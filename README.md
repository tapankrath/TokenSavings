# Token Savings Coach

Tell it what you spend on AI (typed or spoken) and get a ranked plan to spend less, for any AI tool.
A static, installable web app (PWA). No build step, no server.

## Files (all must sit in the repo root, not in a folder)

| File | Purpose |
| --- | --- |
| index.html | The whole app |
| catalog.js | The list of AI platforms and models, and what each offers. Update this file when models change. Upload it with index.html |
| manifest.webmanifest | Makes it installable on a phone |
| sw.js | Offline support |
| icon-192.png, icon-512.png | App icons (deep red) |
| icon-maskable-512.png | Android adaptive icon |
| apple-touch-icon.png | iPhone home screen icon |
| pdf.min.js, pdf.worker.min.js | PDF reader (Mozilla pdf.js 3.11.174), loaded only when someone attaches a PDF |
| pdfjs-LICENSE.txt | Apache 2.0 license for pdf.js |

## Put it on GitHub Pages (works from a phone browser)

1. On github.com, tap **+** then **New repository**. Name it (for example `token-cost-coach`), set it to **Public**, tap **Create repository**.
2. Tap **Add file**, then **Upload files**. Select all the files above (not the zip), then **Commit changes**.
3. Go to **Settings**, then **Pages**. Under **Build and deployment**, set Source to **Deploy from a branch**, Branch to **main** and folder **/ (root)**, then **Save**.
4. Wait 1 to 2 minutes. Your app is at `https://YOUR-USERNAME.github.io/token-cost-coach/`.

## Install on your phone

- **iPhone (Safari):** open the link, tap Share, then **Add to Home Screen**.
- **Android (Chrome):** open the link, tap the **Install on this device** button, or menu then **Install app**.

## How it works

- You describe what you use and what you pay, in dollars, or attach a bill or usage file. No token numbers needed. It works with any AI tool (ChatGPT, Claude, Gemini, Copilot, Cursor and more). If you don't mention an amount, it asks one tap-to-answer question.
- **Subscriptions and API costs are handled separately.** "I pay $20 for ChatGPT Plus and our OpenAI API bill is $600" becomes a $20 plan and a $600 API bill. The API bill gets dollar estimates (model size, trimming context, shorter answers, prompt caching, batch pricing). Flat plans get a usage estimate, since using less doesn't lower a flat price.
- **Attach a file** (paperclip, or drag onto the input on a computer):
  - **CSV usage or cost export:** finds columns like model, input tokens, output tokens, cache reads and cost. Uses your real spend when there is a cost column. Otherwise it estimates from token counts at typical prices and says so. It projects a partial month to a full month.
  - **PDF or Word (.docx) invoice:** finds the total, billing period, model line items and token counts.
  - **Your app's code (HTML, JavaScript, TypeScript or Python):** finds the AI provider and model, the size of the fixed instructions, whether answers are capped, whether chat history is resent, whether caching, batching, web search or images are used, and how many places call an AI provider. It estimates the cost per call and asks roughly how many calls you make a month. It also warns if it sees what looks like a secret API key (the key is never shown or stored). This is pattern matching on the code, not a full analysis, so check the "What I found in your app" list.
  - **PDF, Word or text that is not a bill** is read as a description of how you use AI.
  - **Limits:** one file at a time, up to 25 MB. Old `.doc` files and scanned PDFs (pictures of text) can't be read. Code in other languages isn't analyzed yet. Provider export formats differ, so check the "From your file" list on the report.
  - **Privacy:** files are read in the browser and never uploaded. Only the numbers found in a file are used.
- No account and no API key are needed. Everything is analyzed on the device, and nothing you type or attach is sent anywhere. A smarter server-side analysis can be added later, when there is a backend.
- Savings are estimated from general rules of thumb (shares of your bill), not from any provider's price list. Tune them in the constants at the top of the script in index.html (`IN_SHARE`, `TRIM_CUT`, `CAP_CUT`, `CACHE_SAVE`, `BATCH_CUT`, `MOVE_SHARE`, `RANGE`). When a file has tokens but no cost, the illustrative `PRICES` table is used, so keep it current.

## The built-in demo

Right under the input box, a one-line strip reads **See it work:** with two buttons, **Usage CSV** and **Invoice PDF**. Tapping one loads a fictional company's August 2026 bill (about $5,946 of API spend across three models), runs the same analysis a real upload gets, and opens the results with a banner that says it is a sample. The banner links to the other sample and to **Try it with your own**, which returns to the landing page and restores anything the person had typed or picked before.

The sample data is inside index.html (search for `DEMO_CSV` and `DEMO_PDF`, a text string and a base64 string), so the demo works offline and needs no extra files. To change it, replace those two values. The PDF sample needs the bundled PDF reader files (`pdf.min.js` and `pdf.worker.min.js`) to be uploaded, like any PDF.

## The screens

- **Landing:** a short "What you'll get" explanation, the input box (type, speak or attach; a **Clear** button empties the text and attachment), an optional platform picker, and examples.
- **Results:** dollar ranges for changes you can make, **Cheaper alternatives to try** (each platform's models from lightest to most capable), then advice matched to your situation. People with an API bill see **Bigger changes: architecture and workflow**. People on plans see **Smarter habits for your tools**. Someone with both sees both, without repeats.
- **What I assumed:** the two money fields (API bill and subscriptions) are always shown. Model size, task difficulty and the yes/no questions are tucked into **Fine-tune these guesses**, and are worded to match your situation.

## Platforms, models and recommendations

- **catalog.js** holds the platforms (chat apps, model APIs, big-cloud hosting, fast hosts for open models, coding assistants) and model families. It was last reviewed on 2026-09-19 against providers' public model and pricing pages. Model names change every few weeks, so matching is by family (for example "opus", "flash", "nano") rather than exact versions. To add a platform or update a model name, edit that file only.
- **Picking platforms:** under the input box, "Add your platforms and models" shows four tabs (chat apps, model APIs, coding tools, cloud and hosts). Tap a platform to select it. Selected platforms appear as compact chips; tap a chip to choose its model. The same platforms are also recognized in typed text, invoices and app code. A floating "Find savings" button appears at the bottom whenever the main button has scrolled out of view.
- **Recommendations** come in three groups: dollar estimates for settings you can change, "Bigger changes: architecture and workflow" for developers (model routing, retrieval instead of pasting, answer caching, batch pipelines, keeping agent loops cheap, server-side calls, spend tracking and more), and "Smarter habits for your tools" for everyday users (picking the right model mode, one chat per task, attaching only what's needed, switching off extras, coding-assistant habits). Platform-specific wording appears only for features the providers document, such as caching and batch pricing. Where that isn't known, the advice stays general. The bigger changes are directional ideas with a rough potential and effort label, not dollar promises.
- The app still works if `catalog.js` is missing, but it will not recognize platforms or offer platform-specific advice.

## Updating

After you change any file, open `sw.js` and change `CACHE_VERSION` (for example `v1` to `v2`) so phones fetch the new version.

## Known limits

- Voice input uses the browser's built-in speech recognition, which is stricter on some phones. The app keeps listening and restarts itself if the phone cuts off after a pause, until you tap the mic again. Each start is a clean session: you can stop, edit or delete the text, and start again, and it always resets the recognizer first. If it can't hear you, the message names the cause.
- The on-device analyzer reads plain English with simple rules, so it can misread unusual wording. Every assumption is shown and editable.
- Amounts in $, £ or € are recognized. There is no currency conversion; percentages are the same either way.

## Changing the brand colors and header style

The header logo and name sit in a dark badge (`#10131A`) with a red border (`--brand-line`, a lighter red in dark mode). Inside, "Token Savings" is green (`#5FD47A`), "Coach" is red (`#F0605A`) and the receipt mark is light with a green arrow. All of these are in the CSS at the top of index.html (search for `.brand .b1`, `.brand .b2`, `.logo`). The name is extra-bold (800), so the Google Fonts link requests that weight. The home-screen icons are separate images (icon-192.png, icon-512.png, icon-maskable-512.png, apple-touch-icon.png), so if you change the colors in the header, replace those too. To see a new icon on a phone, delete the home-screen app and add it again.

## Moving to Cloudflare Pages with your own domain

Recommended before you have real users. An installed phone app and anything saved in the browser belong to one web address, so changing the address later means users must reinstall.

1. **Repo:** you can make the GitHub repo private. Cloudflare Pages can deploy from a private repo once you authorize its GitHub app.
2. **Deploy:** in the Cloudflare dashboard go to Workers & Pages, create a Pages project, and connect the GitHub repo. Leave the build command empty and the output directory as the repo root. Deploy, and you get a `*.pages.dev` address.
3. **Domain:** register the domain with Cloudflare (Domain Registration) or point an existing one to it. In the Pages project, open Custom domains and add it. HTTPS is set up automatically.
4. **Clean up:** turn off GitHub Pages in the repo settings so there is one public address.

Cloudflare renames things in its dashboard from time to time, so follow the idea (connect repo, no build step, add custom domain) if the labels differ.

## Credits

PDF reading uses [pdf.js](https://mozilla.github.io/pdf.js/) by Mozilla, licensed under Apache 2.0 (see pdfjs-LICENSE.txt).
