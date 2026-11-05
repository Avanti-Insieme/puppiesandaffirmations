# Puppies and Affirmations (React)

A calm, one-page site: a daily affirmation, a dog photo, and a few small site controls. This is the React version of the original Claude Design export.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build into dist/
npm run preview  # serve the production build
```

## Project layout

```
src/
  main.jsx              entry point; loads the styles
  App.jsx               top-level state: theme, affirmation, hero photo, dialogs
  data.js               presets, color themes and their ramps
  theme.js              applies a theme to the page and saves the choice
  components/
    Nav.jsx             header bar
    Calendar.jsx        month calendar popover
    ThemePicker.jsx     color theme popover
    Hero.jsx            affirmation headline and hero photo
    ImageSlot.jsx       drop or click to add the hero photo
    AdSlot.jsx          ad placeholders
    Footer.jsx          newsletter signup and footer
    NewsletterDialog.jsx
    AdminDialog.jsx     demo sign-in (accepts any password)
    AdminPanel.jsx      hero photo URL, custom message, presets
  styles/
    broadsheet.css      the Broadsheet design system (tokens and components)
    app.css             page-specific styles
```

## Notes

- Icons come from Phosphor (duotone) via the CDN link in `index.html`.
- The hero photo is kept in memory only; reloading the page resets it. The chosen color theme is saved in the browser's local storage.
- The admin sign-in and newsletter form are demo features. Nothing is sent to a server.
- The original static files are kept in `original/` for reference.
