import { useUnit } from 'effector-react';

import { Checkbox } from '@snack-uikit/toggles';

import { $isPaused } from '#entities/is-paused/model';
import { $isAllEnabled, toggleAllProfileMockOverrides } from '#features/selected-profile-mock-overrides/toggle/model';

export function AllMockOverridesCheckbox() {
  const [isPaused, isAllEnabled] = useUnit([$isPaused, $isAllEnabled]);

  return (
    <Checkbox
      data-test-id='mock-overrides-all-checkbox'
      disabled={isPaused}
      checked={isAllEnabled}
      onChange={toggleAllProfileMockOverrides}
    />
  );
}
