# Genscape Architecture

This document outlines the architecture of the Genscape application, focusing on the relationship between Scapes, Widgets, and the Feed.

## Core Concepts

### Scapes

Scapes are modular pages that serve as the main organizational unit of the application. Each scape:

- Contains widgets in a vertical container format
- Can be reordered
- Has a featured widget that represents it in the feed
- Can be published or saved as a draft
- Has permissions and visibility settings

### Widgets

Widgets are components within scapes that provide different functionalities. Each widget:

- Has a type (media, gallery, shop, audio, text, etc.)
- Has a size (small, medium, large)
- Can be positioned vertically within a scape
- Can be connected to other widgets via channels (red, green, blue, neutral)
- Can be featured (becoming the viewpoint of the scape in the feed)
- Can have a caption when featured

### Feed

The feed displays scapes with their featured widgets. The feed:

- Shows the featured widget of each scape as a visual representation
- Displays the featured caption for context
- Allows users to click/tap to navigate to the full scape
- Can be filtered by tabs (Explore, Followed, Shop)

## Data Flow

1. **Scape Creation**:
   - User creates a scape with basic details
   - User adds widgets to the scape
   - User configures each widget with content
   - User selects one widget as the featured widget
   - User adds a caption to the featured widget
   - User publishes the scape

2. **Feed Display**:
   - The feed retrieves published scapes
   - For each scape, it displays the featured widget
   - The featured caption is shown with the widget
   - Users can interact with the scape preview (like, comment, save)

3. **Scape Viewing**:
   - When a user clicks on a scape in the feed, they navigate to the full scape
   - The full scape displays all widgets in their vertical arrangement
   - Users can interact with individual widgets based on their type

## File Structure

```
/models
  - Scape.ts         # Defines the Scape and ScapePreview interfaces
  - Widget.ts        # Defines all widget types and interfaces

/services
  - ScapeService.ts  # Handles API calls for scapes and widgets

/contexts
  - ScapeContext.tsx # Provides state management for scapes

/components
  /feed
    - Feed.tsx       # Main feed component
    - ScapeCard.tsx  # Card component for scapes in the feed
  
  /widgets
    - EnhancedWidgetContainer.tsx  # Container for widgets in the scape editor
    - [WidgetType]Widget.tsx       # Specific widget implementations
  
  /scape
    - FeaturedWidgetEditor.tsx     # Editor for featured widget captions
    - ChannelSelector.tsx          # UI for selecting widget channels
    - ContentBrowser.tsx           # Browser for selecting media content
```

## Widget Types

1. **Media Widget**: Displays images or videos
2. **Gallery Widget**: Displays multiple images in a gallery format
3. **Shop Widget**: Displays products for sale
4. **Audio Widget**: Plays audio files
5. **Text Widget**: Displays formatted text content
6. **Comms Widget**: Provides chat or comment functionality
7. **Button Widget**: Triggers actions or navigates to other content
8. **LLM Widget**: Provides AI chat functionality

## Widget Sizes

Widgets come in three sizes:
- **Small**: 1/3 width (1x3 ratio)
- **Medium**: 2/3 width (2x3 ratio)
- **Large**: Full width (3x3 ratio)

All widgets maintain a uniform height for consistency.

## Widget Channels

Widgets can be connected via channels to create interactive experiences:
- **Red Channel**: For primary interactions
- **Green Channel**: For secondary interactions
- **Blue Channel**: For tertiary interactions
- **Neutral Channel**: For standalone widgets

## Best Practices

1. **Featured Widgets**:
   - Choose a visually appealing widget as the featured widget
   - Write a concise, engaging caption (max 300 characters)
   - Ensure the featured widget represents the scape's content well

2. **Widget Arrangement**:
   - Place the most important content at the top
   - Group related widgets together
   - Use a mix of widget sizes for visual interest
   - Consider the flow of information from top to bottom

3. **Channel Usage**:
   - Use channels to create interactive experiences
   - Connect related widgets with the same channel
   - Use button widgets to trigger actions in other widgets

4. **Performance**:
   - Optimize media for faster loading
   - Don't overload a scape with too many widgets
   - Consider the mobile experience when designing scapes
