import { useState } from "react";
import type { GsapAnimation } from "@hyperframes/core/gsap-parser";
import { useTrackDesignInput } from "../../contexts/DesignPanelInputContext";
import { usePlayerStore } from "../../player";
import { isFocusedEaseRequestCurrent } from "../../player/store/keyframeSlice";
import { AnimationCard } from "./AnimationCard";
import { GsapAddAnimationControl } from "./GsapAddAnimationControl";
import {
  type GsapAnimationEditCallbacks,
  withTrackedGsapAnimationCallbacks,
} from "./gsapAnimationCallbacks";

interface GsapAnimationListProps extends GsapAnimationEditCallbacks {
  elementId: string;
  animations: GsapAnimation[];
  onAddAnimation: (method: "to" | "from" | "set" | "fromTo") => void;
  variant: "classic" | "flat";
}

/** Shared animation cards, telemetry, and timeline-ease focus ownership for both inspectors. */
export function GsapAnimationList({
  elementId,
  animations,
  onAddAnimation,
  variant,
  ...callbacks
}: GsapAnimationListProps) {
  const track = useTrackDesignInput();
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const trackedCallbacks = withTrackedGsapAnimationCallbacks(callbacks, track);
  const focusedEaseSegment = usePlayerStore((state) => state.focusedEaseSegment);
  const clearFocusedEaseSegment = usePlayerStore((state) => state.clearFocusedEaseSegment);
  const timelineProjectId = usePlayerStore((state) => state.timelineProjectId);
  const timelineSessionEpoch = usePlayerStore((state) => state.timelineSessionEpoch);
  const selectedElementId = usePlayerStore((state) => state.selectedElementId);
  const focusedHere =
    focusedEaseSegment &&
    focusedEaseSegment.elementId === elementId &&
    isFocusedEaseRequestCurrent(focusedEaseSegment, {
      timelineProjectId,
      timelineSessionEpoch,
      selectedElementId,
    }) &&
    animations.some((animation) => animation.id === focusedEaseSegment.animationId)
      ? focusedEaseSegment
      : null;

  return (
    <div className="space-y-2">
      {animations.map((animation, index) => (
        <AnimationCard
          {...trackedCallbacks}
          key={animation.id}
          animation={animation}
          defaultExpanded={index === 0}
          flat={variant === "flat"}
          focusedSegment={focusedHere?.animationId === animation.id ? focusedHere : null}
          onFocusSegmentConsumed={() => {
            if (focusedHere?.animationId === animation.id) {
              clearFocusedEaseSegment(focusedHere.nonce);
            }
          }}
        />
      ))}
      <GsapAddAnimationControl
        open={addMenuOpen}
        setOpen={setAddMenuOpen}
        onAddAnimation={onAddAnimation}
        track={track}
        variant={variant}
      />
    </div>
  );
}
