# 🚀 Quiz Game Distribution Setup Guide

This document provides complete instructions for setting up both distribution methods for the "Who Wants To Be A Millionaire?" quiz game.

## 📋 Overview

We've created a **dual-distribution strategy** that provides maximum accessibility:

1. **ZIP Distribution** - For offline local use
2. **GitHub Pages** - For online web access

Both methods target non-technical users who need simple, hassle-free access to the game.

## 📁 Files Created

### Distribution Files

| File                           | Purpose                         | Required For     |
| ------------------------------ | ------------------------------- | ---------------- |
| `README.txt`                   | User guide for ZIP distribution | ZIP Distribution |
| `play-game.bat`                | Windows batch launcher          | ZIP Distribution |
| `README.md`                    | GitHub repository documentation | GitHub Pages     |
| `.gitignore`                   | Version control ignore patterns | GitHub Pages     |
| `.github/workflows/deploy.yml` | Automated deployment workflow   | GitHub Pages     |

### Key Features

- ✅ **Self-contained** - No external dependencies
- ✅ **Cross-platform** - Works on Windows, Mac, Linux browsers
- ✅ **Offline capable** - ZIP version works without internet
- ✅ **Auto-deployment** - GitHub Pages updates automatically
- ✅ **User-friendly** - Simple installation and usage

## 🔧 Setup Instructions

### Method 1: ZIP Distribution Setup

#### For You (Distribution Creator):

1. **Create ZIP Package:**

   ```bash
   # Include these files in the ZIP:
   - index.html
   - css/ (entire directory)
   - scripts/ (entire directory)
   - images/ (entire directory)
   - sounds/ (entire directory)
   - README.txt
   - play-game.bat
   ```

2. **Test the ZIP:**

   - Extract to a test folder
   - Run `play-game.bat` on Windows
   - Or open `index.html` directly in browser
   - Verify all game features work

3. **Distribute:**
   - Upload ZIP to file sharing service (Google Drive, Dropbox, etc.)
   - Share download link with users
   - Include `README.txt` instructions

#### For End Users:

1. Download and extract ZIP file
2. Run `play-game.bat` (Windows) or open `index.html` in browser
3. Enjoy the game!

### Method 2: GitHub Pages Setup

#### Step 1: Create GitHub Repository

1. **Create new repository on GitHub:**

   - Name: `quiz-game-millionaire` (or your preferred name)
   - Set to **Public** (required for free GitHub Pages)
   - Don't initialize with README (we have our own)

2. **Update README.md placeholders:**
   ```markdown
   # In README.md, replace:

   USERNAME.github.io/REPOSITORY_NAME/

   # With your actual:

   yourusername.github.io/quiz-game-millionaire/
   ```

#### Step 2: Upload Files to Repository

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: Quiz game with dual distribution setup"

# Add remote origin (replace with your repository URL)
git remote add origin https://github.com/USERNAME/REPOSITORY_NAME.git

# Push to GitHub
git push -u origin main
```

#### Step 3: Enable GitHub Pages

1. Go to repository **Settings**
2. Scroll to **Pages** section
3. Under **Source**, select **GitHub Actions**
4. The workflow will automatically deploy your site

#### Step 4: Access Your Live Game

- URL: `https://USERNAME.github.io/REPOSITORY_NAME/`
- Updates automatically when you push changes
- Usually takes 2-5 minutes to deploy

## 🎯 User Experience

### ZIP Distribution Users:

1. **Download** → **Extract** → **Double-click `play-game.bat`** → **Play!**
2. Works completely offline
3. No technical setup required

### GitHub Pages Users:

1. **Click link** → **Play immediately**
2. Always get latest version
3. Works on any device with browser

## 🔄 Workflow Features

### Automated Deployment

- **Triggers:** Push to main/master branch
- **Validation:** Checks HTML structure and required directories
- **Deployment:** Uses Jekyll for GitHub Pages compatibility
- **Testing:** Verifies site accessibility after deployment

### Quality Assurance

- HTML validation
- Asset availability checking
- Deployment status verification
- Error reporting in GitHub Actions

## 📝 Next Steps

### Immediate Actions:

1. **Test locally:** Verify all game features work
2. **Create ZIP package:** Bundle files for distribution
3. **Set up GitHub repository:** Follow Method 2 steps above
4. **Update placeholders:** Replace USERNAME/REPOSITORY_NAME in README.md

### Optional Enhancements:

- Add game screenshots to README.md
- Create release tags for versioning
- Set up custom domain for GitHub Pages
- Add analytics tracking
- Create additional language versions

## 🎮 Game Features Included

### Core Gameplay:

- 15 progressive difficulty questions
- $100 to $1,000,000 prize structure
- Safe haven checkpoints at $1,000 and $32,000

### Lifelines:

- **50/50:** Remove two wrong answers
- **Phone a Friend:** Get helpful hints
- **Ask the Audience:** See crowd favorites

### Technical Features:

- Bilingual support (English/Chinese)
- Background music and sound effects
- Responsive design for desktop
- LocalStorage for settings persistence

## 🆘 Troubleshooting

### Common Issues:

**ZIP Distribution:**

- **Batch file won't run:** Right-click → "Run as administrator"
- **Browser doesn't open:** Manually open `index.html`
- **Missing sounds:** Check if browser blocks autoplay

**GitHub Pages:**

- **404 errors:** Check repository is public and Pages is enabled
- **Deployment fails:** Check GitHub Actions tab for errors
- **Assets missing:** Verify file paths are relative

### Support Resources:

- Check browser console for JavaScript errors
- Verify all asset files are included
- Test in multiple browsers (Chrome, Firefox, Safari, Edge)

## 📄 License & Distribution

- Game uses standard web technologies (HTML/CSS/JS)
- No external dependencies or copyrighted content
- Safe for redistribution with proper attribution
- Consider adding LICENSE file for open source distribution

---

**Ready to distribute your quiz game to the world! 🌟**
