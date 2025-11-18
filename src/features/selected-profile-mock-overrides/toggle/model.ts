import { combine, createEvent, sample } from 'effector';

import { $selectedProfileMockOverrides } from '#entities/request-profile/model/selected-mock-overrides';
import { selectedProfileMockOverridesUpdated } from '#features/selected-profile-mock-overrides/update/model';

export const toggleAllProfileMockOverrides = createEvent<boolean>();

export const $isAllEnabled = combine($selectedProfileMockOverrides, overrides => overrides.every(m => !m.disabled), {
  skipVoid: false,
});

sample({
  clock: toggleAllProfileMockOverrides,
  source: $selectedProfileMockOverrides,
  fn: (overrides, enabled) => overrides.map(m => ({ ...m, disabled: !enabled })),
  target: selectedProfileMockOverridesUpdated,
});
