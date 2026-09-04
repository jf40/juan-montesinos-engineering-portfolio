# Juan Montesinos — Engineering Portfolio

Static HTML/CSS/JS portfolio.

## Project photo filenames

Put your photos inside the `assets` folder using these exact names:

- `triple-clamp.jpg` — top triple clamp project
- `motostudent-chassis.jpg` — tubular mainframe chassis
- `formula-student-harness.jpg` — harness mounting brackets
- `formula-student-brake-pedal.jpg` — brake pedal plate / FEA

The website already points to these names, so you do not need to edit `index.html`.

If your image is PNG instead of JPG, either export/rename it as a JPG, or change the corresponding `.jpg` extension in `index.html` to `.png`.

## GitHub Pages updates

After editing locally, upload the changed files to the repository root and commit them. GitHub Pages will redeploy automatically.

## Project photo carousels

Add images to `assets/` using continuous numbering. Each image can independently be **JPG, JPEG or PNG**, so you can mix formats in the same carousel. No HTML or JavaScript edits are needed.

### Top triple clamp
- `triple-clamp-01.jpg` or `triple-clamp-01.png`
- `triple-clamp-02.jpg` or `triple-clamp-02.png`
- `triple-clamp-03.jpg` or `triple-clamp-03.png`
- ...

### MotoStudent chassis
- `motostudent-chassis-01.jpg` or `motostudent-chassis-01.png`
- `motostudent-chassis-02.jpg` or `motostudent-chassis-02.png`
- ...

### Formula Student harness brackets
- `formula-student-harness-01.jpg` or `formula-student-harness-01.png`
- `formula-student-harness-02.jpg` or `formula-student-harness-02.png`
- ...

### Formula Student brake pedal
- `formula-student-brake-pedal-01.jpg` or `formula-student-brake-pedal-01.png`
- `formula-student-brake-pedal-02.jpg` or `formula-student-brake-pedal-02.png`
- ...

Rules:
- Supported extensions: `.jpg`, `.jpeg`, `.png`.
- Use lowercase file extensions.
- Start at `01` and keep the numbering continuous.
- You can mix formats, e.g. `triple-clamp-01.png`, `triple-clamp-02.jpg`, `triple-clamp-03.png`.
- Do not upload two files with the same prefix and number in different formats; if you do, the priority is JPG → JPEG → PNG.
- One image: no carousel controls.
- Two or more images: arrows, dots and swipe navigation.
