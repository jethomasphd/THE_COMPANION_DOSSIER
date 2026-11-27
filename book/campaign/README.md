# The Twelfth Door — campaign playbook

*Using This Matter* · A Novel of the Companion Estate · Jacob E. Thomas, MA, PhD
Destination for every post: **https://the-companion-dossier.com/book**

> The novel is presented as a recovered archive. The campaign is the deposit's
> missing exhibit: fragments that reach people before the book does, and
> point them back to it.

---

## 1. The idea in one paragraph

A missing AI scientist. An estate of transcripts and sealed rooms. An archivist who counts **eleven doors on the county plan and twelve in her inventory.** The campaign never explains any of that directly. It leaks it out as **recovered posts**: posts from neighbours, users, and readers of the deposit that look as if someone saved them before they were deleted. Every fragment carries the title, the URL, and one line of disclosure. The website then gives people something to *do*: count the doors, open the withheld plate, play the transmissions, find Door 12.

## 2. What's in this folder

| Path | What it is |
|---|---|
| `README.md` | This playbook: rules, phases, calendar, measurement. |
| `social-copy.md` | Captions, threads, short-video scripts, ad variants, and email copy, ready to paste. |
| `cards/` | 45 rendered social cards (JPEG): 9 in-world posts and 6 quote cards, each in **portrait** 1080×1350 (feed), **story** 1080×1920 (Stories, Reels, TikTok covers; it keeps the top 230 px and bottom 270 px clear for app UI), and **landscape** 1200×675 (X, Bluesky, LinkedIn). `manifest.json` lists them. |
| `card.html` | The card template. It draws from `../evidence.js`, the same file the website uses. |
| `render_cards.py` | Re-renders every card, plus the site's link-preview image `../assets/og-card.jpg`. It auto-scales each post to fill the frame without overflowing. |

**To add or change a recovered post:** edit `book/evidence.js`. To make it a campaign card, add `campaign: true` and a short `hook:` line. Then run:

```bash
pip install playwright && playwright install chromium   # once
python book/campaign/render_cards.py                    # from the repository root
```

## 3. The rules of the fiction (non-negotiable)

The story begins on the page. The site and the campaign are immersive: in-world posts appear as posts, with no labels and no fourth-wall breaks. The real project does the rest. The talk, the paper, and the protocol are real, and they're linked openly so the line between the novel and the world blurs on purpose. A few rules keep it clean.

1. **The world can post; readers can't be invented.** Characters, neighbors and strangers inside the story can post anything the story supports. Never write fictional reviews, ratings, testimonials or "reader reactions" to the book itself, anywhere: not on the site, not in ads, not on retailer or review platforms. Social proof must be real: the World's Fair talk, the SSRN paper, the open repository, and, when they come, real reviews quoted with permission.
2. **The real is linked, never faked.** Every real-world claim (the talk, the paper, the repository, the dispatches, the sealed file, the Watchtower) links to the actual thing. Don't invent press, awards, sales figures or endorsements.
3. **Invented people only.** In-world posts never use a real person, company, agency or platform name or logo. Before posting a handle on a live platform, check that it doesn't belong to a real account; if it does, change it.
4. **The dates do the work.** In-world posts are dated spring 2027, after "now". That's the book's own device: its copyright page is dated earlier than the events it records.
5. **No invented commerce.** No prices, discounts, countdowns, scarcity, preorder states or release dates unless true. The print button turns on only when `book/config.js` holds the real Amazon URL.
6. **Spoiler wall.** Stay inside the premise: the house, the count, the voices, the interruption *as an event*, the withheld illustration, and the existence of the second hand. Never reveal what the interruption says, what the sealed record contains, who the second hand is, or how anything ends.
7. **Protect the real people.** The novel displaces its people ("an offset of a real figure, never the figure"). Never link an in-world character to a real private person. Your own identity as the author is the one real person the campaign leans on.
8. **The answer is always one click away.** The site's FAQ and the book's front matter say plainly which parts are the novel. Campaign captions name the book. If someone asks directly whether Dr. Thorne is real, answer honestly: he's the novel's; the machine is real.

## 4. Phases

| Phase | Window | Name | Goal | Primary assets |
|---|---|---|---|---|
| 0 | Days 1–10 | **The Feed** | Shock. In-world posts from spring 2027, one a day, no explanation. | `cards/post-*` (portrait + story); the voice memo as a Reel. |
| 1 | Days 8–14 | **The Plan** | Interaction. Post the book's floor plan and ask people to count the doors and comment their number. | The Plate XI page as printed (`book/assets/the-plan.png`); quote card `doors`; the site's `#plan` section. |
| 2 | Days 12–18 | **The Footage** | Comprehension. Explain the premise in 20 and 90 seconds. | the 90-second story trailer (the only film on the site, `#trailer`); the 20-second promos are social-only. |
| 3 | Days 16–24 | **The Deposit Opens** | Conversion. Free digital reading now; print when it's live. | Quote cards; `#read`; email. |
| 4 | Ongoing | **The Twelfth Door** | Retention. Reward the people who dug in. | `/book/twelve/`, the browser-console note, reply-only hints. |

**Never post the Door 12 URL in a feed.** It's found three ways: the faint "Twelve?" link in the site footer, the browser console, and replies to people who comment "12" on count posts. ("Exterior doors are excluded from the interior count. Try the footer.")

## 5. Twenty-one-day calendar (organic)

Times are suggestions. Post the portrait card to the feed, and the story card to stories at the same time.

| Day | Feed (IG / Threads / Bluesky / X) | Short video (Reels / TikTok / Shorts) | Notes |
|---|---|---|---|
| 1 | Post card: `nb-house` | — | No explanation. |
| 2 | Post card: `vm-hum` | The voice memo as a 36 s Reel (`book/assets/posts/memo-014.m4a` over the story card) | "Sound on." |
| 3 | Post card: `fr-vessel` | — | |
| 4 | Quote card: `doors` | Promo: *The Missing Scientist* (20s) | First full title reveal. |
| 5 | Post card: `mb-lecture` | — | |
| 6 | Post card: `mb-dispatch` | — | |
| 7 | **The turn:** "Dr. Thorne is fiction. His machine is not." Carousel: the World's Fair talk, the SSRN paper, the repo | — | Awe. Link the real things. |
| 8 | **Post the floor plan** (Plate XI, `book/assets/the-plan.png`) | Fingertip counting doors on the printed page | Ask: "How many did you get?" |
| 9 | Post card: `fr-prism` | — | |
| 10 | Post card: `mb-ladder` | — | |
| 11 | Clip from the World's Fair talk (with permission of the event) | — | "The doubt at the center of the novel is a real research question." |
| 12 | Trailer (90s) on YouTube + feed cut | Promo: *The Archive Is Reading Her* | The 90s trailer is the only film on the site. |
| 13 | Post card: `mb-bigger` | — | |
| 14 | Quote card: `fiction` | — | "The narrative is fiction. The estate is not." |
| 15 | Long thread (text, §4 of social-copy.md) | — | |
| 16 | **Read it free:** full-novel push | Author to camera: "I built the machine in this book. Here's what happened when I wrote about it." | Understanding → action. |
| 17 | "Run the protocol yourself": link to The Harness | — | The real product. |
| 18 | Quote card: `keep` | — | |
| 19 | Behind the glass: how the book was made (*The Hand and the Glass*) | — | Honest process post; links pp. v–vi. |
| 20 | Post card: `mb-twelve` | — | Reply-only Door 12 hints begin. |
| 21 | Recap carousel + clear CTA | Trailer cut-down | "Read it tonight. It's free." |

When Amazon goes live, change the end of every caption to the print line in `social-copy.md` § 7.

## 6. UTM scheme

`https://the-companion-dossier.com/book?utm_source={platform}&utm_medium={organic_social|paid_social|email|referral}&utm_campaign=twelfth_door&utm_content={asset-id}`

- `utm_content` = the card file stem, e.g. `post-nb-house-portrait`, `quote-doors-story`, `lay_trailer_90s`.
- Use the `#story`, `#trailer`, `#plan`, `#readers`, `#first-page` or `#read` anchors when a post is about that section.

## 7. Measurement

The page dispatches local `book:engagement` DOM events. It sends nothing over the network and stores nothing. Connect an analytics tool separately if you want aggregate numbers. Events:

| Event | Fires when |
|---|---|
| `free_read` | A free digital edition link is clicked (`placement`: hero, access, faq). |
| `amazon_click` | The print button is clicked (only once `config.js` has the Amazon URL). |
| `trailer_play` | The 90-second trailer starts. |
| `evidence_filter` / `evidence_more` / `thread_open` | Interaction with the recovered posts. |
| `transmission_play` | A transmission card is played. |
| `volume_turn` | The 3D book is dragged. |

**Signals that it's working:** comment counts on floor-plan posts, people quoting "11 / 12" back, saves on cards, and the ratio of `free_read` clicks to page views.

## 8. Paid amplification (optional, small)

- **Test:** three in-world portrait cards (`nb-house`, `vm-hum`, `fr-vessel`) against quote card `doors`, with the same audience and $5–10 a day each for 5 days. Keep the winner.
- **Audiences:** readers of literary horror, archival and found-document fiction, AI ethics, and epistemic thrillers. Lookalikes from site visitors once you have enough.
- **Platform policies:** narrative ad creative is allowed; name the book in the primary text. Never run testimonials or ratings.

## 9. Community and Reddit

- Follow every subreddit's self-promotion rules. Disclose authorship in the first line: *"I wrote a novel told as a recovered archive…"*
- Good fits: found-document and epistolary fiction discussions, literary horror, AI and society. Lead with the *form* (inventories, transcripts, two hands in the margins), not with a sales pitch.
- Never seed in-world posts into real communities as if they were real. In-world material lives on the author's own channels and on the site.

## 10. Accessibility

- Every card has a text equivalent: its caption in `social-copy.md` includes the post text. Paste it as alt text.
- Videos carry burned-in captions, and SRT/VTT files sit beside them in `media/`.
- The site respects `prefers-reduced-motion`. The transmissions and the 3D book work by keyboard; the floor plan is a still image with full alt text.
