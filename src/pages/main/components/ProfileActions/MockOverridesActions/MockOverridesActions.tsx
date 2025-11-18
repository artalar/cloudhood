import { useUnit } from 'effector-react';

import { ButtonFunction } from '@snack-uikit/button';
import { PlusSVG, TrashSVG } from '@snack-uikit/icons';
import { Typography } from '@snack-uikit/typography';

import { $isPaused } from '#entities/is-paused/model';
import { $isProfileRemoveAvailable } from '#entities/request-profile/model';
import { selectedProfileRemoved } from '#features/selected-profile/remove/model';
import { selectedProfileMockOverridesAdded } from '#features/selected-profile-mock-overrides/add/model';
import { ProfileActionsLayout } from '#shared/components';
import { MockOverrides } from '#widgets/mock-overrides';

import { AllMockOverridesCheckbox } from './AllMockOverridesCheckbox';

export function MockOverridesActions() {
  const [isPaused, handleRemove, isProfileRemoveAvailable] = useUnit([
    $isPaused,
    selectedProfileRemoved,
    $isProfileRemoveAvailable,
  ]);

  const handleAddMockOverride = () => {
    selectedProfileMockOverridesAdded([{ disabled: false, urlPattern: '', responseContent: '' }]);
  };

  const leftHeaderActions = (
    <>
      <AllMockOverridesCheckbox />
      <Typography.SansTitleM data-test-id='profile-overrides-section'>Mock Overrides</Typography.SansTitleM>
    </>
  );

  const rightHeaderActions = (
    <>
      <ButtonFunction
        disabled={isPaused}
        data-test-id='add-mock-override-button'
        icon={<PlusSVG />}
        onClick={handleAddMockOverride}
      />
      <ButtonFunction
        data-test-id='remove-mock-override-button'
        icon={<TrashSVG />}
        disabled={isPaused || !isProfileRemoveAvailable}
        onClick={handleRemove}
      />
    </>
  );

  return (
    <ProfileActionsLayout leftHeaderActions={leftHeaderActions} rightHeaderActions={rightHeaderActions}>
      <MockOverrides />
    </ProfileActionsLayout>
  );
}
