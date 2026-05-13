# The Pantheon

Stable portraits of every figure summoned across the Dossier. Each chamber's
JavaScript (e.g. `The_Chair/js/hologram.js`, `The_5_Lamps/js/hologram.js`)
loads images from this directory by exact filename — `../The_Pantheon/<Slug>.jpg`
in almost every case, plus one `.jpeg` for Eugene V. Debs.

## How portraits get here

Manual. Download the lead image from each person's Wikipedia article (or use
the curated Wikimedia Commons URLs listed below for the historical figures),
then drop the file into this directory with the **exact filename** in the
table. Browsers sniff content from the bytes, not the extension, so it's fine
to save a PNG with a `.jpg` filename — but the filename itself must match.

## Expected filenames

| Filename | Person | Source |
| --- | --- | --- |
| `George_Washington.jpg` | George Washington | https://commons.wikimedia.org/wiki/File:Gilbert_Stuart_Williamstown_Portrait_of_George_Washington.jpg |
| `Alexander_Hamilton.jpg` | Alexander Hamilton | https://commons.wikimedia.org/wiki/File:Alexander_Hamilton_portrait_by_John_Trumbull_1806.jpg |
| `Thomas_Jefferson.jpg` | Thomas Jefferson | https://commons.wikimedia.org/wiki/File:Official_Presidential_portrait_of_Thomas_Jefferson_(by_Rembrandt_Peale,_1800).jpg |
| `Benjamin_Franklin.jpg` | Benjamin Franklin | https://commons.wikimedia.org/wiki/File:Benjamin_Franklin_by_Joseph_Duplessis_1778.jpg |
| `Abraham_Lincoln.jpg` | Abraham Lincoln | https://commons.wikimedia.org/wiki/File:Abraham_Lincoln_O-77_matte_collodion_print.jpg |
| `Theodore_Roosevelt.jpg` | Theodore Roosevelt | https://commons.wikimedia.org/wiki/File:Theodore_Roosevelt_by_the_Pach_Bros.jpg |
| `Franklin_D_Roosevelt.jpg` | Franklin D. Roosevelt | https://commons.wikimedia.org/wiki/File:FDR_1944_Color_Portrait.jpg |
| `William_Lloyd_Garrison.jpg` | William Lloyd Garrison | https://commons.wikimedia.org/wiki/File:William_Lloyd_Garrison,_abolitionist,_journalist,_and_editor_of_The_Liberator_LCCN2017660623_(cropped).jpg |
| `Eugene_V_Debs.jpeg` | Eugene V. Debs (note `.jpeg`) | https://commons.wikimedia.org/wiki/File:Eugene_Debs_portrait.jpeg |
| `Martin_Luther_King_Jr.jpg` | Martin Luther King Jr. | https://commons.wikimedia.org/wiki/File:Martin_Luther_King,_Jr..jpg |
| `Tony_Stark.jpg` | Tony Stark (Robert Downey Jr.) | https://en.wikipedia.org/wiki/File:Robert_Downey_Jr._as_Tony_Stark_in_Avengers_Infinity_War.jpg |
| `Hippocrates.jpg` | Hippocrates | https://en.wikipedia.org/wiki/Hippocrates |
| `John_Snow.jpg` | John Snow (physician) | https://en.wikipedia.org/wiki/John_Snow_(physician) |
| `Michael_Marmot.jpg` | Sir Michael Marmot | https://en.wikipedia.org/wiki/Michael_Marmot |
| `Carl_Jung.jpg` | Carl Jung | https://en.wikipedia.org/wiki/Carl_Jung |
| `Paul_Farmer.jpg` | Paul Farmer (physician) | https://en.wikipedia.org/wiki/Paul_Farmer_(physician) |
| `Steve_Jobs.jpg` | Steve Jobs | https://en.wikipedia.org/wiki/Steve_Jobs |
| `Warren_Buffett.jpg` | Warren Buffett | https://en.wikipedia.org/wiki/Warren_Buffett |
| `Henry_Ford.jpg` | Henry Ford | https://en.wikipedia.org/wiki/Henry_Ford |
| `Andrew_Carnegie.jpg` | Andrew Carnegie | https://en.wikipedia.org/wiki/Andrew_Carnegie |
| `Thomas_Edison.jpg` | Thomas Edison | https://en.wikipedia.org/wiki/Thomas_Edison |
| `Walt_Disney.jpg` | Walt Disney | https://en.wikipedia.org/wiki/Walt_Disney |
| `Socrates.jpg` | Socrates | https://en.wikipedia.org/wiki/Socrates |
| `Maria_Montessori.jpg` | Maria Montessori | https://en.wikipedia.org/wiki/Maria_Montessori |
| `John_Dewey.jpg` | John Dewey | https://en.wikipedia.org/wiki/John_Dewey |
| `Ada_Lovelace.jpg` | Ada Lovelace | https://en.wikipedia.org/wiki/Ada_Lovelace |
| `Paulo_Freire.jpg` | Paulo Freire | https://en.wikipedia.org/wiki/Paulo_Freire |

## Adding a new person to the Pantheon

1. Pick a slug in `Snake_Case` (e.g. `Jane_Addams`).
2. Save the portrait here as `Jane_Addams.jpg`.
3. Reference it from the relevant chamber's `js/hologram.js` and/or `index.html`
   using `../The_Pantheon/Jane_Addams.jpg`.
4. Add a row to the table above so the manifest stays current.
