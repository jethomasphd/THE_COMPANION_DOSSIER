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
| `cards/` | 48 rendered social cards (JPEG): 10 recovered posts and 6 quote cards, each in **portrait** 1080×1350 (feed), **story** 1080×1920 (Stories, Reels, TikTok covers; it keeps the top 230 px and bottom 270 px clear for app UI), and **landscape** 1200×675 (X, Bluesky, LinkedIn). `manifest.json` lists them. |
| `card.html` | The card template. It draws from `../evidence.js`, the same file the website uses. |
| `render_cards.py` | Re-renders every card, plus the site's link-preview image `../assets/og-card.jpg`. It auto-scales each post to fill the frame without overflowing. |

**To add or change a recovered post:** edit `book/evidence.js`. To make it a campaign card, add `campaign: true` and a short `hook:` line. Then run:

```bash
pip install playwright && playwright install chromium   # once
python book/campaign/render_cards.py                    # from the repository root
```

## 3. The rules of the fiction (non-negotiable)

The novel's opening statement is called *The Hand and the Glass*, and it ends: *"The glass is shown. The hand remains answerable."* The campaign follows the same rule. The fiction can be as immersive as it likes, but it cannot leave anyone deceived.

1. **In-world voices testify about the story's events, never about the book.** A recovered post can be a neighbour describing the house, or a user describing the interruption. It is never a fake review, a fake reader rating, or a fake critic's blurb. Real reviews, when they exist, are quoted under real names, with permission.
2. **Every in-world fragment carries its frame.** On a card, that's the footer line *"An exhibit of the fiction · names, handles & timestamps invented."* In a caption, it's the title plus "a novel" or #fiction. On the site, it's the Editor's note above the wall.
3. **Invented people only.** Never write as a real person, a real company, a real agency, or a real platform. Don't use platform logos. Before you use a handle on a live platform, check that it doesn't belong to a real account. If it does, change it.
4. **The dates do the work.** Many posts are dated 2027–2028, after "now". The deposit is described as made public in the summer of 2027, so the campaign is visibly arriving from a record that hasn't happened yet. That's the book's own device: its copyright page is dated earlier than the events it records.
5. **No invented commerce.** No prices, discounts, countdowns, scarcity, preorder states, or release dates unless they are true. The print button turns on only when `book/config.js` holds the real Amazon URL.
6. **Spoiler wall.** Campaign material stays inside the premise: the commission, the house, the count, the voices, the interruption *as an event*, the withheld plate, and the existence of the second hand. Never reveal what the interruption says, what the sealed record contains, who the second hand is, or how anything ends.
7. **Protect the real people.** The book "displaces" its people ("an offset of a real figure, never the figure"). The campaign does too: it never links an in-world character to a real person.

## 4. Phases

| Phase | Window | Name | Goal | Primary assets |
|---|---|---|---|---|
| 0 | Days 1–10 | **The Mirror** | Curiosity. Unexplained recovered posts, one a day. | `cards/post-*` (portrait + story). Captions: "Recovered. n of 13." |
| 1 | Days 8–14 | **The Count** | Interaction. Get people to count the doors and comment their number. | Screen recording of the count; quote card `doors`; the site's `#count` section. |
| 2 | Days 12–18 | **The Footage** | Comprehension. Explain the premise in 20 and 90 seconds. | `media/lay/*` promos + trailer; `#footage`. |
| 3 | Days 16–24 | **The Deposit Opens** | Conversion. Free digital reading now; print when it's live. | Quote cards; `#access`; email. |
| 4 | Ongoing | **The Twelfth Door** | Retention. Reward the people who dug in. | `/book/twelve/`, the browser-console note, reply-only hints. |

**Never post the Door 12 URL in a feed.** It's found three ways: the faint "Twelve?" link in the site footer, the browser console, and replies to people who comment "12" on count posts. ("Exterior doors are excluded from the interior count. Try the footer.")

## 5. Twenty-one-day calendar (organic)

Times are suggestions. Post the portrait card to the feed, and the story card to stories at the same time.

| Day | Feed (IG / Threads / Bluesky / X) | Short video (Reels / TikTok / Shorts) | Notes |
|---|---|---|---|
| 1 | Recovered post: `nb-caliche` (neighbourhood board) | — | Caption A0 only. Don't explain. |
| 2 | Recovered post: `fr-vessel` (forum) | — | |
| 3 | Recovered post: `vm-hum` (voice memo) | — | Pin comment: link to the site. |
| 4 | Quote card: `doors` | Promo: *The Missing Scientist* (20s) | First title reveal in the caption. |
| 5 | Recovered post: `mb-deposit` | — | |
| 6 | Recovered post: `rv-bats` (map review) | — | |
| 7 | Carousel: 4 recovered posts | — | Caption: "Before the deposit was public, people talked." |
| 8 | **Launch The Count** | Screen-record the count, ending on 12 | Ask: "How many did you get?" |
| 9 | Quote card: `believe` | Duet/stitch prompt: "Count with me" | Reply "12" commenters with the hint. |
| 10 | Recovered post: `mb-dispatch` | — | |
| 11 | Recovered post: `ch-second-hand` (chat) | — | |
| 12 | Trailer (90s) on YouTube + feed cut | Promo: *The Archive Is Reading Her* | |
| 13 | Recovered post: `mb-plate-vii` | — | Link to the withheld plate on the site. |
| 14 | Quote card: `fiction` | — | "The narrative is fiction. The estate is not." Bridge to the real Dossier. |
| 15 | Long thread (text): the recovered thread from the site | — | Post as a thread with card images. |
| 16 | **Deposit Opens:** free digital edition push | Author to camera: "The book is free. Here's why print exists." | Optional; author's choice. |
| 17 | Recovered post: `mb-reader-count` | — | |
| 18 | Quote card: `keep` (or `sealed` / `courteous`) | — | |
| 19 | Behind the glass: how the book was made (*The Hand and the Glass*) | — | Honest process post; links pp. v–vi. |
| 20 | Recovered post: `mb-twelve` | — | Reply-only Door 12 hints begin. |
| 21 | Recap carousel + clear CTA | Trailer cut-down | "Read it freely. Hold it in print." |

When Amazon goes live, change the end of every caption to the print line in `social-copy.md` § 7.

## 6. UTM scheme

`https://the-companion-dossier.com/book?utm_source={platform}&utm_medium={organic_social|paid_social|email|referral}&utm_campaign=twelfth_door&utm_content={asset-id}`

- `utm_content` = the card file stem, e.g. `post-nb-caliche-portrait`, `quote-doors-story`, `lay_trailer_90s`.
- Use `#count`, `#evidence`, `#footage` or `#access` anchors when a post is about that section.

## 7. Measurement

The page dispatches local `book:engagement` DOM events. It sends nothing over the network and stores nothing. Connect an analytics tool separately if you want aggregate numbers. Events:

| Event | Fires when |
|---|---|
| `free_read` | A free digital edition link is clicked (`placement`: hero, access, faq). |
| `amazon_click` | The print button is clicked (only once `config.js` has the Amazon URL). |
| `trailer_play` | The 90-second trailer starts. |
| `count_twelve` | A visitor reaches twelve in The Count. |
| `count_recount` | A visitor finishes the recount. |
| `evidence_filter` / `evidence_more` / `thread_open` | Interaction with the recovered posts. |
| `transmission_play` | A transmission card is played. |
| `volume_turn` | The 3D book is dragged. |

**Signals that it's working:** comment counts on count posts, people quoting "11 / 12" back, saves on cards, and the ratio of `count_twelve` to page views.

## 8. Paid amplification (optional, small)

- **Test:** three portrait cards (`nb-caliche`, `vm-hum`, `fr-vessel`) against quote card `doors`, with the same audience and $5–10 a day each for 5 days. Keep the winner.
- **Audiences:** readers of literary horror, archival and found-document fiction, AI ethics, and epistemic thrillers. Lookalikes from site visitors once you have enough.
- **Platform policies:** fictional, narrative-framed ad creative is allowed, but say it's a novel in the primary text. The card footer already carries the disclosure.

## 9. Community and Reddit

- Follow every subreddit's self-promotion rules. Disclose authorship in the first line: *"I wrote a novel told as a recovered archive…"*
- Good fits: found-document and epistolary fiction discussions, literary horror, AI and society. Lead with the *form* (inventories, transcripts, two hands in the margins), not with a sales pitch.
- Never seed in-world posts into real communities as if they were real. In-world material lives on the author's own channels and on the site.

## 10. Accessibility

- Every card has a text equivalent: its caption in `social-copy.md` includes the post text. Paste it as alt text.
- Videos carry burned-in captions, and SRT/VTT files sit beside them in `media/`.
- The site respects `prefers-reduced-motion`. The count, transmissions, and 3D book all work by keyboard.
