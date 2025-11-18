import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { useUnit } from 'effector-react';

import { $selectedProfileMockOverrides } from '#entities/request-profile/model/selected-mock-overrides';
import { dragEnded, dragOver, dragStarted, restrictToParentElement } from '#entities/sortable-list';
import {
  $draggableMockOverride,
  $flattenMockOverrides,
} from '#features/selected-profile-mock-overrides/reorder/model';
import { isDefined } from '#shared/utils/typeGuards';

import { MockOverrideRow } from './components/MockOverrideRow';
import * as S from './styled';

export function MockOverrides() {
  const { mockOverrides, flattenMockOverrides, activeMockOverride } = useUnit({
    mockOverrides: $selectedProfileMockOverrides,
    flattenMockOverrides: $flattenMockOverrides,
    activeMockOverride: $draggableMockOverride,
  });

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  return (
    <DndContext
      modifiers={[restrictToParentElement]}
      sensors={sensors}
      onDragStart={dragStarted}
      onDragOver={dragOver}
      onDragEnd={dragEnded}
    >
      <S.Wrapper>
        <SortableContext items={flattenMockOverrides}>
          {mockOverrides.map(override => (
            <MockOverrideRow key={override.id} {...override} />
          ))}
        </SortableContext>
      </S.Wrapper>
      <DragOverlay>{isDefined(activeMockOverride) ? <MockOverrideRow {...activeMockOverride} /> : null}</DragOverlay>
    </DndContext>
  );
}
