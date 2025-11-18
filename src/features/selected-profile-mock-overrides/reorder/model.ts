import { DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { attach, combine, sample } from 'effector';

import {
  $requestProfiles,
  $selectedProfileMockOverrides,
  $selectedRequestProfile,
  profileUpdated,
} from '#entities/request-profile/model';
import {
  createSortableListModel,
  dragEnded,
  dragOver,
  dragStarted,
  type SortableItemId,
  type SortableItemIdOrNull,
} from '#entities/sortable-list';

export const {
  $flattenItems: $flattenMockOverrides,
  $dragTarget: $dragTargetMockOverrides,
  $raisedItem: $raisedMockOverride,
  reorderItems,
  itemsUpdated,
} = createSortableListModel({
  $items: $selectedProfileMockOverrides,
  $selectedItem: $selectedRequestProfile,
  $allItems: $requestProfiles.map(profiles => profiles.map(profile => profile.mockOverrides || [])),
  itemsUpdated: profileUpdated,
});

export const $draggableMockOverride = combine(
  [$raisedMockOverride, $selectedProfileMockOverrides],
  ([raisedId, overrides]) => (raisedId ? overrides.find(override => override.id === raisedId) : null),
);

const reorderMockOverridesFx = attach({
  source: { profiles: $requestProfiles, selectedProfile: $selectedRequestProfile },
  effect: ({ profiles, selectedProfile }, payload: { active: string | number; target: string | number }) => {
    const { active, target } = payload;

    const profile = profiles.find(p => p.id === selectedProfile);

    if (!profile) {
      return null;
    }

    const mockOverrides = profile.mockOverrides || [];
    const activeIndex = mockOverrides.findIndex(override => override.id === active);
    const targetIndex = mockOverrides.findIndex(override => override.id === target);

    if (activeIndex === -1 || targetIndex === -1) {
      return null;
    }

    return {
      id: profile.id,
      ...(profile.name && { name: profile.name }),
      requestHeaders: profile.requestHeaders,
      urlFilters: profile.urlFilters,
      mockOverrides: arrayMove(mockOverrides, activeIndex, targetIndex),
    };
  },
});

sample({
  clock: dragStarted,
  filter: (event: DragStartEvent) => Boolean(event.active.id),
  fn: (event: DragStartEvent) => event.active.id as string | number,
  target: $raisedMockOverride,
});

sample({
  clock: dragOver,
  filter: (event: DragOverEvent) => Boolean(event.over?.id),
  fn: (event: DragOverEvent) => event.over?.id as string | number,
  target: $dragTargetMockOverrides,
});

const mockOverrideMoved = sample({
  clock: dragEnded,
  source: { active: $raisedMockOverride, target: $dragTargetMockOverrides },
  filter(src: {
    active: SortableItemIdOrNull;
    target: SortableItemIdOrNull;
  }): src is { active: SortableItemId; target: SortableItemId } {
    return Boolean(src.active) && Boolean(src.target) && src.active !== src.target;
  },
});

sample({ clock: mockOverrideMoved, target: reorderMockOverridesFx });
sample({
  clock: reorderMockOverridesFx.doneData,
  filter: Boolean,
  target: profileUpdated,
});

$dragTargetMockOverrides.reset(reorderMockOverridesFx.finally);
$raisedMockOverride.reset(reorderMockOverridesFx.finally);
