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

Upload the images directly to `assets/`. The live GitHub Pages site automatically reads that folder and creates each carousel.

Supported formats:
- `.png`
- `.jpg`
- `.jpeg`

### Naming

Top triple clamp:
- `triple-clamp-01.png`
- `triple-clamp-02.jpg`
- `triple-clamp-03.png`

MotoStudent chassis:
- `motostudent-chassis-01.png`
- `motostudent-chassis-02.jpg`

Formula Student harness:
- `formula-student-harness-01.png`
- `formula-student-harness-02.jpg`

Formula Student brake pedal:
- `formula-student-brake-pedal-01.png`
- `formula-student-brake-pedal-02.jpg`

The number determines the order in the carousel. You may mix PNG/JPG/JPEG, and gaps in numbering are allowed.

The website uses GitHub's public repository API to discover the images automatically, so adding new photos does not require editing `index.html` or `script.js`.
