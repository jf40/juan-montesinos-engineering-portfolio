# Juan Montesinos — Engineering Portfolio

A dependency-free static website: plain HTML, CSS and a tiny amount of JavaScript.

## Files

- `index.html` — all portfolio content
- `styles.css` — responsive visual design
- `script.js` — mobile navigation + small utilities
- `assets/Juan_Montesinos_CV.pdf` — current CV

## Preview locally

Open `index.html` directly in a browser, or run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Free hosting

### GitHub Pages
1. Create a new GitHub repository.
2. Upload the contents of this folder to the repository root.
3. In **Settings → Pages**, choose **Deploy from a branch**.
4. Select the `main` branch and `/ (root)`.
5. GitHub will give you a public URL.

### Netlify / Cloudflare Pages
You can also drag-and-drop this folder to Netlify, or connect the GitHub repository to Cloudflare Pages.
No build command is required.

## Important: project images

The first prototype references a few images from the old Google Sites portfolio so the design is immediately usable.
For the final version, copy your original project images into `assets/` and replace the Google image URLs in `index.html`.
That makes the portfolio fully self-contained and prevents Google-hosted image links from ever breaking.

## Recommended next edits

1. Add your Automotiva role and project details once the exact wording is decided.
2. Add 2–5 high-quality images to each major project.
3. Add quantitative results where you can disclose them (mass, factor of safety, stiffness, iteration count, etc.).
4. Add LinkedIn / GitHub links if you want them shown.
5. Once the project content is final, split the three strongest projects into dedicated case-study pages.
