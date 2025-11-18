import { attach, createEvent, sample } from 'effector';

import { $requestProfiles, $selectedRequestProfile, profileUpdated } from '#entities/request-profile/model';
import { MockOverride } from '#entities/request-profile/types';
import { generateId } from '#shared/utils/generateId';

type SelectedProfileMockOverridesAdded = Omit<MockOverride, 'id'>[];

export const selectedProfileMockOverridesAdded = createEvent<SelectedProfileMockOverridesAdded>();

const selectedProfileMockOverridesAddedFx = attach({
  source: { profiles: $requestProfiles, selectedProfile: $selectedRequestProfile },
  effect: ({ profiles, selectedProfile }, mockOverrides: SelectedProfileMockOverridesAdded) => {
    const profile = profiles.find(p => p.id === selectedProfile);

    if (!profile) {
      throw new Error('Profile not found');
    }

    return {
      ...profile,
      mockOverrides: [...(profile.mockOverrides || []), ...mockOverrides.map(m => ({ ...m, id: generateId() }))],
    };
  },
});

sample({ clock: selectedProfileMockOverridesAdded, target: selectedProfileMockOverridesAddedFx });
sample({ clock: selectedProfileMockOverridesAddedFx.doneData, target: profileUpdated });
