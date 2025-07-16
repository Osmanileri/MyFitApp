// 🏋️‍♂️ BODY MAP TYPES
// Type definitions for body map components

/**
 * @typedef {Object} MuscleGroup
 * @property {string} id - Unique identifier for the muscle group
 * @property {string} name - Turkish name of the muscle group
 * @property {string} nameEn - English name of the muscle group
 * @property {'front' | 'back' | 'both'} view - Which view(s) this muscle group appears in
 * @property {Object} coordinates - SVG path coordinates for both views
 * @property {string|null} coordinates.front - Front view SVG path
 * @property {string|null} coordinates.back - Back view SVG path
 * @property {string} hoverColor - Color when hovered
 * @property {string} defaultColor - Default color
 * @property {string[]} exercises - Array of exercise IDs
 * @property {string} description - Description of the muscle group
 */

/**
 * @typedef {Object} BodyMapContainerProps
 * @property {function(MuscleGroup): void} onMuscleGroupPress - Callback when muscle group is pressed
 * @property {'front' | 'back'} [initialView='front'] - Initial view to show
 * @property {Object} [style] - Custom style object
 * @property {boolean} [disabled=false] - Whether the body map is disabled
 */

/**
 * @typedef {Object} MuscleGroupComponentProps
 * @property {MuscleGroup} muscleGroup - The muscle group data
 * @property {boolean} isHovered - Whether the muscle group is being hovered
 * @property {boolean} isSelected - Whether the muscle group is selected
 * @property {function(): void} onPress - Callback when pressed
 * @property {function(boolean): void} onHover - Callback when hover state changes
 * @property {Object} animationValue - Reanimated shared value for animations
 */

/**
 * @typedef {Object} BodySvgProps
 * @property {'front' | 'back'} currentView - Current view being displayed
 * @property {MuscleGroup[]} muscleGroups - Array of muscle groups to render
 * @property {string|null} selectedMuscleGroup - ID of currently selected muscle group
 * @property {function(MuscleGroup): void} onMuscleGroupPress - Callback when muscle group is pressed
 * @property {function(string, boolean): void} onMuscleGroupHover - Callback when muscle group hover changes
 * @property {number} width - SVG width
 * @property {number} height - SVG height
 */

/**
 * @typedef {Object} RotateButtonProps
 * @property {'front' | 'back'} currentView - Current view
 * @property {function('front' | 'back'): void} onRotate - Callback when rotate button is pressed
 * @property {Object} [style] - Custom style object
 */

/**
 * @typedef {Object} HoverOverlayProps
 * @property {MuscleGroup|null} hoveredMuscleGroup - Currently hovered muscle group
 * @property {number} x - X position of the overlay
 * @property {number} y - Y position of the overlay
 * @property {boolean} visible - Whether the overlay is visible
 */

/**
 * @typedef {Object} ExerciseListModalProps
 * @property {boolean} visible - Whether the modal is visible
 * @property {MuscleGroup|null} muscleGroup - The muscle group to show exercises for
 * @property {function(): void} onClose - Callback when modal is closed
 * @property {function(Exercise): void} onExerciseSelect - Callback when exercise is selected
 */

/**
 * @typedef {Object} Exercise
 * @property {string} id - Unique identifier for the exercise
 * @property {string} name - Exercise name in Turkish
 * @property {string} nameEn - Exercise name in English
 * @property {'Kolay' | 'Orta' | 'Zor'} difficulty - Difficulty level
 * @property {string} equipment - Required equipment
 * @property {string} description - Exercise description
 * @property {string} muscleGroup - Primary muscle group
 * @property {string[]} secondaryMuscles - Secondary muscle groups
 * @property {boolean} hasLocalAnimation - Whether exercise has local animation
 * @property {string} videoUrl - URL to exercise video
 * @property {string} imageUrl - URL to exercise image
 */

/**
 * @typedef {Object} AnimationConfig
 * @property {number} duration - Animation duration in milliseconds
 * @property {number} damping - Spring animation damping
 * @property {number} stiffness - Spring animation stiffness
 * @property {number} mass - Spring animation mass
 * @property {number} restSpeedThreshold - Speed threshold for animation rest
 * @property {number} restDisplacementThreshold - Displacement threshold for animation rest
 */

/**
 * @typedef {Object} BodyMapColors
 * @property {string} background - Background color
 * @property {string} surface - Surface color
 * @property {string} bodyOutline - Body outline color
 * @property {string} bodyFill - Body fill color
 * @property {string} default - Default muscle group color
 * @property {string} hover - Hover state color
 * @property {string} selected - Selected state color
 * @property {string} text - Text color
 * @property {string} textSecondary - Secondary text color
 */

/**
 * @typedef {Object} GestureEvent
 * @property {Object} nativeEvent - Native event object
 * @property {number} nativeEvent.x - X coordinate of the touch
 * @property {number} nativeEvent.y - Y coordinate of the touch
 * @property {number} nativeEvent.absoluteX - Absolute X coordinate
 * @property {number} nativeEvent.absoluteY - Absolute Y coordinate
 */

/**
 * @typedef {Object} UseBodyMapReturn
 * @property {'front' | 'back'} currentView - Current view
 * @property {function('front' | 'back'): void} setCurrentView - Set current view
 * @property {string|null} selectedMuscleGroup - Selected muscle group ID
 * @property {function(string|null): void} setSelectedMuscleGroup - Set selected muscle group
 * @property {string|null} hoveredMuscleGroup - Hovered muscle group ID
 * @property {function(string|null): void} setHoveredMuscleGroup - Set hovered muscle group
 * @property {function(): void} toggleView - Toggle between front and back view
 * @property {function(): void} resetSelection - Reset all selections
 */

export {}; 