import { combine } from 'effector';

import { $requestProfiles } from './request-profiles';
import { $selectedRequestProfile } from './selected-request-profile';

export const $selectedProfileMockOverrides = combine(
  $selectedRequestProfile,
  $requestProfiles,
  (selectedProfileId, profiles) => profiles.find(p => p.id === selectedProfileId)?.mockOverrides ?? [],
  { skipVoid: false },
);

export const $selectedProfileActiveMockOverridesCount = combine(
  $selectedProfileMockOverrides,
  overrides => overrides.filter(item => !item.disabled && item.urlPattern.trim() && item.responseContent.trim()).length,
  { skipVoid: false },
);
