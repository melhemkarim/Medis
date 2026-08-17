Drop photos AND/OR short video clips from a previous event here, named
exactly:

gallery-1  (use .jpg/.jpeg/.png/.webp for a photo, or .mp4/.webm/.mov for a video)
gallery-2
gallery-3
gallery-4
gallery-5
gallery-6

These are used on the "A look back" panel (between the countdown and the
RSVP screen). Photos hold for ~3 seconds then crossfade to the next item.
Videos autoplay muted (browsers require this) and advance automatically as
soon as the clip finishes — keep clips short (a few seconds each) so the
slideshow keeps moving.

You don't need all 6 — any file that's missing is skipped silently. Want
more than 6, or need to change which filenames are photos vs. videos? Edit
the GALLERY_ITEMS array in components/GallerySlide.tsx (the file extension
you use there is what decides photo vs. video). Any size/aspect ratio
works for photos, it's cropped automatically.
