# Upgrading from IDPrivacy to VX

This document outlines the changes made to generalize the package from "IDPrivacy" to "VX" (Voice Experience).

## File Renaming

The following files have been renamed:
- `lib/sdk/IDPrivacyAssistant.tsx` → `lib/sdk/VXAssistant.tsx`
- `lib/sdk/idprivacy-client.ts` → `lib/sdk/vx-client.ts`

## Component Renaming

The following components have been renamed:
- `IDPrivacyAssistant` → `VXAssistant`
- `IDPrivacyClient` → `VXClient`
- `IDPrivacyAssistantProps` → `VXAssistantProps`
- `IDPrivacyClientConfig` → `VXClientConfig`

## Button Text Changes

All instances of "Talk to IDPrivacy" have been changed to "Talk to VX" in:
- Button text in hero components
- Documentation references
- Component examples

## CSS Class Renaming

CSS class naming has been updated from `idprivacy-*` to `vx-*`:

| Old Class | New Class |
|-----------|-----------|
| `idprivacy-black` | `vx-black` |
| `idprivacy-white` | `vx-white` |
| `idprivacy-gray` | `vx-gray` |
| `idprivacy-teal` | `vx-teal` |
| `idprivacy-pink` | `vx-pink` |
| `idprivacy-yellow` | `vx-yellow` |
| `idprivacy-peach` | `vx-peach` |
| `idprivacy-red` | `vx-red` |
| `idprivacy-green` | `vx-green` |
| `idprivacy-cream` | `vx-cream` |
| `idprivacy-lightgray` | `vx-lightgray` |

## Tailwind Configuration

To update your Tailwind configuration, add the following color definitions to your `tailwind.config.js` file:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        // VX color palette
        'vx-black': '#111111',
        'vx-white': '#FFFFFF',
        'vx-gray': '#6B7280',
        'vx-teal': '#09706E',
        'vx-pink': '#F472B6',
        'vx-yellow': '#FBBF24',
        'vx-peach': '#FDBA74',
        'vx-red': '#EF4444',
        'vx-green': '#10B981',
        'vx-cream': '#F5F5DC',
        'vx-lightgray': '#E5E7EB',
      },
    },
  },
};
```

See `tailwind.example.js` for a full example.

## Changes in industry-content.ts

The `industry-content.ts` file contains many references to "IDPrivacy" in strings that represent content intended to be displayed to users. These have not been automatically changed as they may require more careful consideration based on your specific branding needs.

If you wish to update these references, you should review the file and replace:
- Company name references
- Product descriptions
- Testimonial quotes
- Copyright text
- URLs

## Additional Changes Required

When implementing this package in your project, you may need to:

1. Update any custom components that reference "IDPrivacy"
2. Update any documentation that references "IDPrivacy"
3. Update URLs and links that point to IDPrivacy domains
4. Update branding assets like logos and favicons

## How to Verify Your Updates

After making these changes, you can verify everything works correctly by:

1. Running `grep -r "idprivacy" your-project-directory` to find any remaining references
2. Testing the voice assistant functionality to ensure all components work correctly
3. Inspecting the UI to ensure all styling appears as expected 