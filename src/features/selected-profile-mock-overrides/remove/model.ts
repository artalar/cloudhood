import { attach, createEvent, sample } from 'effector';

import { $requestProfiles, $selectedRequestProfile, profileUpdated } from '#entities/request-profile/model';
import { MockOverride } from '#entities/request-profile/types';

export const selectedProfileMockOverridesRemoved = createEvent<MockOverride['id'][]>();

const selectedProfileMockOverridesRemovedFx = attach({
  source: { profiles: $requestProfiles, selectedProfile: $selectedRequestProfile },
  effect: ({ profiles, selectedProfile }, overridesId: MockOverride['id'][]) => {
    const profile = profiles.find(p => p.id === selectedProfile);

    if (!profile) {
      throw new Error('Profile not found');
    }

    return {
      ...profile,
      mockOverrides: (profile.mockOverrides || []).filter(m => !overridesId.includes(m.id)),
    };
  },
});

sample({ clock: selectedProfileMockOverridesRemoved, target: selectedProfileMockOverridesRemovedFx });
sample({ clock: selectedProfileMockOverridesRemovedFx.doneData, target: profileUpdated });
