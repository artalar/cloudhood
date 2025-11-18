import { attach, createEvent, sample } from 'effector';

import { $requestProfiles, $selectedRequestProfile, profileUpdated } from '#entities/request-profile/model';
import type { MockOverride } from '#entities/request-profile/types';

export const selectedProfileMockOverridesUpdated = createEvent<MockOverride[]>();

const selectedProfileMockOverridesUpdatedFx = attach({
  source: { profiles: $requestProfiles, selectedProfile: $selectedRequestProfile },
  effect: ({ profiles, selectedProfile }, updatedOverrides: MockOverride[]) => {
    const profile = profiles.find(p => p.id === selectedProfile);

    if (!profile) {
      throw new Error('Profile not found');
    }

    return {
      ...profile,
      mockOverrides: (profile.mockOverrides || []).map(override => {
        const updatedOverride = updatedOverrides.find(m => m.id === override.id);
        if (updatedOverride) {
          return { ...updatedOverride };
        }

        return override;
      }),
    };
  },
});

sample({ clock: selectedProfileMockOverridesUpdated, target: selectedProfileMockOverridesUpdatedFx });
sample({ clock: selectedProfileMockOverridesUpdatedFx.doneData, target: profileUpdated });
