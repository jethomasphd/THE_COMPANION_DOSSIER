/* ═══════════════════════════════════════════════════════════════
   TAKE ACTION — U.S. Senator Database (119th Congress, Jan 2025)
   Two senators per state. Data may need updating for cabinet
   appointments or special elections.
   Format: { n: name, p: party, w: senate.gov subdomain slug }
   ═══════════════════════════════════════════════════════════════ */

var SENATORS = {
  'AL': [{n:'Katie Britt',p:'R',w:'britt'},{n:'Tommy Tuberville',p:'R',w:'tuberville'}],
  'AK': [{n:'Lisa Murkowski',p:'R',w:'murkowski'},{n:'Dan Sullivan',p:'R',w:'sullivan'}],
  'AZ': [{n:'Mark Kelly',p:'D',w:'kelly'},{n:'Ruben Gallego',p:'D',w:'gallego'}],
  'AR': [{n:'John Boozman',p:'R',w:'boozman'},{n:'Tom Cotton',p:'R',w:'cotton'}],
  'CA': [{n:'Alex Padilla',p:'D',w:'padilla'},{n:'Adam Schiff',p:'D',w:'schiff'}],
  'CO': [{n:'Michael Bennet',p:'D',w:'bennet'},{n:'John Hickenlooper',p:'D',w:'hickenlooper'}],
  'CT': [{n:'Richard Blumenthal',p:'D',w:'blumenthal'},{n:'Chris Murphy',p:'D',w:'murphy'}],
  'DE': [{n:'Chris Coons',p:'D',w:'coons'},{n:'Lisa Blunt Rochester',p:'D',w:'bluntrochester'}],
  'FL': [{n:'Rick Scott',p:'R',w:'rickscott'},{n:'Ashley Moody',p:'R',w:'moody'}],
  'GA': [{n:'Jon Ossoff',p:'D',w:'ossoff'},{n:'Raphael Warnock',p:'D',w:'warnock'}],
  'HI': [{n:'Mazie Hirono',p:'D',w:'hirono'},{n:'Brian Schatz',p:'D',w:'schatz'}],
  'ID': [{n:'Mike Crapo',p:'R',w:'crapo'},{n:'Jim Risch',p:'R',w:'risch'}],
  'IL': [{n:'Dick Durbin',p:'D',w:'durbin'},{n:'Tammy Duckworth',p:'D',w:'duckworth'}],
  'IN': [{n:'Todd Young',p:'R',w:'young'},{n:'Jim Banks',p:'R',w:'banks'}],
  'IA': [{n:'Chuck Grassley',p:'R',w:'grassley'},{n:'Joni Ernst',p:'R',w:'ernst'}],
  'KS': [{n:'Jerry Moran',p:'R',w:'moran'},{n:'Roger Marshall',p:'R',w:'marshall'}],
  'KY': [{n:'Mitch McConnell',p:'R',w:'mcconnell'},{n:'Rand Paul',p:'R',w:'paul'}],
  'LA': [{n:'Bill Cassidy',p:'R',w:'cassidy'},{n:'John Kennedy',p:'R',w:'kennedy'}],
  'ME': [{n:'Susan Collins',p:'R',w:'collins'},{n:'Angus King',p:'I',w:'king'}],
  'MD': [{n:'Chris Van Hollen',p:'D',w:'vanhollen'},{n:'Angela Alsobrooks',p:'D',w:'alsobrooks'}],
  'MA': [{n:'Elizabeth Warren',p:'D',w:'warren'},{n:'Ed Markey',p:'D',w:'markey'}],
  'MI': [{n:'Gary Peters',p:'D',w:'peters'},{n:'Elissa Slotkin',p:'D',w:'slotkin'}],
  'MN': [{n:'Amy Klobuchar',p:'D',w:'klobuchar'},{n:'Tina Smith',p:'D',w:'smith'}],
  'MS': [{n:'Roger Wicker',p:'R',w:'wicker'},{n:'Cindy Hyde-Smith',p:'R',w:'hydesmith'}],
  'MO': [{n:'Josh Hawley',p:'R',w:'hawley'},{n:'Eric Schmitt',p:'R',w:'schmitt'}],
  'MT': [{n:'Steve Daines',p:'R',w:'daines'},{n:'Tim Sheehy',p:'R',w:'sheehy'}],
  'NE': [{n:'Deb Fischer',p:'R',w:'fischer'},{n:'Pete Ricketts',p:'R',w:'ricketts'}],
  'NV': [{n:'Catherine Cortez Masto',p:'D',w:'cortezmasto'},{n:'Jacky Rosen',p:'D',w:'rosen'}],
  'NH': [{n:'Jeanne Shaheen',p:'D',w:'shaheen'},{n:'Maggie Hassan',p:'D',w:'hassan'}],
  'NJ': [{n:'Cory Booker',p:'D',w:'booker'},{n:'Andy Kim',p:'D',w:'andykim'}],
  'NM': [{n:'Martin Heinrich',p:'D',w:'heinrich'},{n:'Ben Ray Lujan',p:'D',w:'lujan'}],
  'NY': [{n:'Chuck Schumer',p:'D',w:'schumer'},{n:'Kirsten Gillibrand',p:'D',w:'gillibrand'}],
  'NC': [{n:'Thom Tillis',p:'R',w:'tillis'},{n:'Ted Budd',p:'R',w:'budd'}],
  'ND': [{n:'John Hoeven',p:'R',w:'hoeven'},{n:'Kevin Cramer',p:'R',w:'cramer'}],
  'OH': [{n:'Bernie Moreno',p:'R',w:'moreno'},{n:'Jim Jordan',p:'R',w:'jordan'}],
  'OK': [{n:'James Lankford',p:'R',w:'lankford'},{n:'Markwayne Mullin',p:'R',w:'mullin'}],
  'OR': [{n:'Ron Wyden',p:'D',w:'wyden'},{n:'Jeff Merkley',p:'D',w:'merkley'}],
  'PA': [{n:'John Fetterman',p:'D',w:'fetterman'},{n:'Dave McCormick',p:'R',w:'mccormick'}],
  'RI': [{n:'Jack Reed',p:'D',w:'reed'},{n:'Sheldon Whitehouse',p:'D',w:'whitehouse'}],
  'SC': [{n:'Lindsey Graham',p:'R',w:'lgraham'},{n:'Tim Scott',p:'R',w:'scott'}],
  'SD': [{n:'John Thune',p:'R',w:'thune'},{n:'Mike Rounds',p:'R',w:'rounds'}],
  'TN': [{n:'Marsha Blackburn',p:'R',w:'blackburn'},{n:'Bill Hagerty',p:'R',w:'hagerty'}],
  'TX': [{n:'John Cornyn',p:'R',w:'cornyn'},{n:'Ted Cruz',p:'R',w:'cruz'}],
  'UT': [{n:'Mike Lee',p:'R',w:'lee'},{n:'John Curtis',p:'R',w:'curtis'}],
  'VT': [{n:'Bernie Sanders',p:'I',w:'sanders'},{n:'Peter Welch',p:'D',w:'welch'}],
  'VA': [{n:'Mark Warner',p:'D',w:'warner'},{n:'Tim Kaine',p:'D',w:'kaine'}],
  'WA': [{n:'Patty Murray',p:'D',w:'murray'},{n:'Maria Cantwell',p:'D',w:'cantwell'}],
  'WV': [{n:'Shelley Moore Capito',p:'R',w:'capito'},{n:'Jim Justice',p:'R',w:'justice'}],
  'WI': [{n:'Tammy Baldwin',p:'D',w:'baldwin'},{n:'Ron Johnson',p:'R',w:'ronjohnson'}],
  'WY': [{n:'John Barrasso',p:'R',w:'barrasso'},{n:'Cynthia Lummis',p:'R',w:'lummis'}]
};

var STATE_NAMES = {
  'AL':'Alabama','AK':'Alaska','AZ':'Arizona','AR':'Arkansas','CA':'California',
  'CO':'Colorado','CT':'Connecticut','DE':'Delaware','FL':'Florida','GA':'Georgia',
  'HI':'Hawaii','ID':'Idaho','IL':'Illinois','IN':'Indiana','IA':'Iowa',
  'KS':'Kansas','KY':'Kentucky','LA':'Louisiana','ME':'Maine','MD':'Maryland',
  'MA':'Massachusetts','MI':'Michigan','MN':'Minnesota','MS':'Mississippi','MO':'Missouri',
  'MT':'Montana','NE':'Nebraska','NV':'Nevada','NH':'New Hampshire','NJ':'New Jersey',
  'NM':'New Mexico','NY':'New York','NC':'North Carolina','ND':'North Dakota','OH':'Ohio',
  'OK':'Oklahoma','OR':'Oregon','PA':'Pennsylvania','RI':'Rhode Island','SC':'South Carolina',
  'SD':'South Dakota','TN':'Tennessee','TX':'Texas','UT':'Utah','VT':'Vermont',
  'VA':'Virginia','WA':'Washington','WV':'West Virginia','WI':'Wisconsin','WY':'Wyoming'
};

/* ═══════════════════════════════════════════════════════════════
   U.S. House Representatives Database (119th Congress, Jan 2025)
   435 members across 50 states. At-large states use d:0.
   Format: { n: name, p: party, d: district, w: house.gov slug }
   Contact URLs: https://{slug}.house.gov/contact
   Data may need updating for special elections or resignations.
   ═══════════════════════════════════════════════════════════════ */

var REPRESENTATIVES = {
  'AL': [
    {n:'Jerry Carl',p:'R',d:1,w:'carl'},
    {n:'Barry Moore',p:'R',d:2,w:'barrymoore'},
    {n:'Mike Rogers',p:'R',d:3,w:'mikerogers'},
    {n:'Robert Aderholt',p:'R',d:4,w:'aderholt'},
    {n:'Dale Strong',p:'R',d:5,w:'strong'},
    {n:'Gary Palmer',p:'R',d:6,w:'palmer'},
    {n:'Terri Sewell',p:'D',d:7,w:'sewell'}
  ],
  'AK': [
    {n:'Mary Peltola',p:'D',d:0,w:'peltola'}
  ],
  'AZ': [
    {n:'David Schweikert',p:'R',d:1,w:'schweikert'},
    {n:'Eli Crane',p:'R',d:2,w:'crane'},
    {n:'Bob Stanton',p:'R',d:3,w:'stanton'},
    {n:'Greg Stanton',p:'D',d:4,w:'gregstanton'},
    {n:'Andy Biggs',p:'R',d:5,w:'biggs'},
    {n:'Juan Ciscomani',p:'R',d:6,w:'ciscomani'},
    {n:'Raul Grijalva',p:'D',d:7,w:'grijalva'},
    {n:'Debbie Lesko',p:'R',d:8,w:'lesko'},
    {n:'Paul Gosar',p:'R',d:9,w:'gosar'}
  ],
  'AR': [
    {n:'Rick Crawford',p:'R',d:1,w:'crawford'},
    {n:'French Hill',p:'R',d:2,w:'hill'},
    {n:'Steve Womack',p:'R',d:3,w:'womack'},
    {n:'Bruce Westerman',p:'R',d:4,w:'westerman'}
  ],
  'CA': [
    {n:'Doug LaMalfa',p:'R',d:1,w:'lamalfa'},
    {n:'Jared Huffman',p:'D',d:2,w:'huffman'},
    {n:'Kevin Kiley',p:'R',d:3,w:'kiley'},
    {n:'Mike Thompson',p:'D',d:4,w:'mikethompson'},
    {n:'Tom McClintock',p:'R',d:5,w:'mcclintock'},
    {n:'Ami Bera',p:'D',d:6,w:'bera'},
    {n:'Doris Matsui',p:'D',d:7,w:'matsui'},
    {n:'John Garamendi',p:'D',d:8,w:'garamendi'},
    {n:'Josh Harder',p:'D',d:9,w:'harder'},
    {n:'Mark DeSaulnier',p:'D',d:10,w:'desaulnier'},
    {n:'Nancy Pelosi',p:'D',d:11,w:'pelosi'},
    {n:'Barbara Lee',p:'D',d:12,w:'lee'},
    {n:'John Duarte',p:'R',d:13,w:'duarte'},
    {n:'Eric Swalwell',p:'D',d:14,w:'swalwell'},
    {n:'Kevin Mullin',p:'D',d:15,w:'kevinmullin'},
    {n:'Sam Liccardo',p:'D',d:16,w:'liccardo'},
    {n:'Ro Khanna',p:'D',d:17,w:'khanna'},
    {n:'Zoe Lofgren',p:'D',d:18,w:'lofgren'},
    {n:'Jimmy Panetta',p:'D',d:19,w:'panetta'},
    {n:'Jim Costa',p:'D',d:20,w:'costa'},
    {n:'Vince Fong',p:'R',d:21,w:'fong'},
    {n:'David Valadao',p:'R',d:22,w:'valadao'},
    {n:'Jay Obernolte',p:'R',d:23,w:'obernolte'},
    {n:'Salud Carbajal',p:'D',d:24,w:'carbajal'},
    {n:'Raul Ruiz',p:'D',d:25,w:'ruiz'},
    {n:'Julia Brownley',p:'D',d:26,w:'juliabrownley'},
    {n:'Mike Garcia',p:'R',d:27,w:'mikegarcia'},
    {n:'Judy Chu',p:'D',d:28,w:'chu'},
    {n:'Tony Cardenas',p:'D',d:29,w:'cardenas'},
    {n:'Sydney Kamlager-Dove',p:'D',d:30,w:'kamlager-dove'},
    {n:'Grace Napolitano',p:'D',d:31,w:'napolitano'},
    {n:'Brad Sherman',p:'D',d:32,w:'sherman'},
    {n:'Pete Aguilar',p:'D',d:33,w:'aguilar'},
    {n:'Jimmy Gomez',p:'D',d:34,w:'gomez'},
    {n:'Norma Torres',p:'D',d:35,w:'torres'},
    {n:'Ted Lieu',p:'D',d:36,w:'lieu'},
    {n:'Linda Sanchez',p:'D',d:37,w:'lindasanchez'},
    {n:'Mark Takano',p:'D',d:38,w:'takano'},
    {n:'Young Kim',p:'R',d:39,w:'youngkim'},
    {n:'Ken Calvert',p:'R',d:40,w:'calvert'},
    {n:'Robert Garcia',p:'D',d:41,w:'robertgarcia'},
    {n:'Maxine Waters',p:'D',d:42,w:'waters'},
    {n:'Nanette Barragan',p:'D',d:43,w:'barragan'},
    {n:'Michelle Steel',p:'R',d:44,w:'steel'},
    {n:'Lou Correa',p:'D',d:45,w:'correa'},
    {n:'Sara Jacobs',p:'D',d:46,w:'sarajacobs'},
    {n:'Darrell Issa',p:'R',d:48,w:'issa'},
    {n:'Mike Levin',p:'D',d:49,w:'mikelevin'},
    {n:'Scott Peters',p:'D',d:50,w:'scottpeters'},
    {n:'Juan Vargas',p:'D',d:51,w:'vargas'},
    {n:'Derek Tran',p:'D',d:47,w:'tran'}
  ],
  'CO': [
    {n:'Diana DeGette',p:'D',d:1,w:'degette'},
    {n:'Joe Neguse',p:'D',d:2,w:'neguse'},
    {n:'Jeff Crank',p:'R',d:3,w:'crank'},
    {n:'Lauren Boebert',p:'R',d:4,w:'boebert'},
    {n:'Jeff Hurd',p:'R',d:5,w:'hurd'},
    {n:'Jason Crow',p:'D',d:6,w:'crow'},
    {n:'Brittany Pettersen',p:'D',d:7,w:'pettersen'},
    {n:'Yadira Caraveo',p:'D',d:8,w:'caraveo'}
  ],
  'CT': [
    {n:'John Larson',p:'D',d:1,w:'larson'},
    {n:'Joe Courtney',p:'D',d:2,w:'courtney'},
    {n:'Rosa DeLauro',p:'D',d:3,w:'delauro'},
    {n:'Jim Himes',p:'D',d:4,w:'himes'},
    {n:'Jahana Hayes',p:'D',d:5,w:'hayes'}
  ],
  'DE': [
    {n:'Sarah McBride',p:'D',d:0,w:'mcbride'}
  ],
  'FL': [
    {n:'Matt Gaetz',p:'R',d:1,w:'gaetz'},
    {n:'Neal Dunn',p:'R',d:2,w:'dunn'},
    {n:'Kat Cammack',p:'R',d:3,w:'cammack'},
    {n:'Aaron Bean',p:'R',d:4,w:'bean'},
    {n:'John Rutherford',p:'R',d:5,w:'rutherford'},
    {n:'Michael Waltz',p:'R',d:6,w:'waltz'},
    {n:'Cory Mills',p:'R',d:7,w:'mills'},
    {n:'Bill Posey',p:'R',d:8,w:'posey'},
    {n:'Darren Soto',p:'D',d:9,w:'soto'},
    {n:'Maxwell Frost',p:'D',d:10,w:'frost'},
    {n:'Daniel Webster',p:'R',d:11,w:'webster'},
    {n:'Gus Bilirakis',p:'R',d:12,w:'bilirakis'},
    {n:'Anna Paulina Luna',p:'R',d:13,w:'luna'},
    {n:'Kathy Castor',p:'D',d:14,w:'castor'},
    {n:'Laurel Lee',p:'R',d:15,w:'laurellee'},
    {n:'Vern Buchanan',p:'R',d:16,w:'buchanan'},
    {n:'Greg Steube',p:'R',d:17,w:'steube'},
    {n:'Scott Franklin',p:'R',d:18,w:'franklin'},
    {n:'Byron Donalds',p:'R',d:19,w:'donalds'},
    {n:'Sheila Cherfilus-McCormick',p:'D',d:20,w:'cherfilus-mccormick'},
    {n:'Brian Mast',p:'R',d:21,w:'mast'},
    {n:'Lois Frankel',p:'D',d:22,w:'frankel'},
    {n:'Jared Moskowitz',p:'D',d:23,w:'moskowitz'},
    {n:'Frederica Wilson',p:'D',d:24,w:'wilson'},
    {n:'Debbie Wasserman Schultz',p:'D',d:25,w:'wassermanschultz'},
    {n:'Mario Diaz-Balart',p:'R',d:26,w:'mariodiazbalart'},
    {n:'Maria Elvira Salazar',p:'R',d:27,w:'salazar'},
    {n:'Carlos Gimenez',p:'R',d:28,w:'gimenez'}
  ],
  'GA': [
    {n:'Buddy Carter',p:'R',d:1,w:'buddycarter'},
    {n:'Sanford Bishop',p:'D',d:2,w:'bishop'},
    {n:'Drew Ferguson',p:'R',d:3,w:'ferguson'},
    {n:'Hank Johnson',p:'D',d:4,w:'hankjohnson'},
    {n:'Nikema Williams',p:'D',d:5,w:'nikemawilliams'},
    {n:'Rich McCormick',p:'R',d:6,w:'richmccormick'},
    {n:'Lucy McBath',p:'D',d:7,w:'mcbath'},
    {n:'Austin Scott',p:'R',d:8,w:'austinscott'},
    {n:'Andrew Clyde',p:'R',d:9,w:'clyde'},
    {n:'Mike Collins',p:'R',d:10,w:'mikecollins'},
    {n:'Barry Loudermilk',p:'R',d:11,w:'loudermilk'},
    {n:'Rick Allen',p:'R',d:12,w:'rickallen'},
    {n:'David Scott',p:'D',d:13,w:'davidscott'},
    {n:'Marjorie Taylor Greene',p:'R',d:14,w:'greene'}
  ],
  'HI': [
    {n:'Ed Case',p:'D',d:1,w:'case'},
    {n:'Jill Tokuda',p:'D',d:2,w:'tokuda'}
  ],
  'ID': [
    {n:'Russ Fulcher',p:'R',d:1,w:'fulcher'},
    {n:'Mike Simpson',p:'R',d:2,w:'simpson'}
  ],
  'IL': [
    {n:'Jonathan Jackson',p:'D',d:1,w:'jonathanjackson'},
    {n:'Robin Kelly',p:'D',d:2,w:'robinkelly'},
    {n:'Delia Ramirez',p:'D',d:3,w:'deliaramirez'},
    {n:'Jesus Garcia',p:'D',d:4,w:'chuygarcia'},
    {n:'Mike Quigley',p:'D',d:5,w:'quigley'},
    {n:'Sean Casten',p:'D',d:6,w:'casten'},
    {n:'Danny Davis',p:'D',d:7,w:'davis'},
    {n:'Raja Krishnamoorthi',p:'D',d:8,w:'krishnamoorthi'},
    {n:'Jan Schakowsky',p:'D',d:9,w:'schakowsky'},
    {n:'Brad Schneider',p:'D',d:10,w:'schneider'},
    {n:'Bill Foster',p:'D',d:11,w:'foster'},
    {n:'Mike Bost',p:'R',d:12,w:'bost'},
    {n:'Nikki Budzinski',p:'D',d:13,w:'budzinski'},
    {n:'Lauren Underwood',p:'D',d:14,w:'underwood'},
    {n:'Mary Miller',p:'R',d:15,w:'marymiller'},
    {n:'Darin LaHood',p:'R',d:16,w:'lahood'},
    {n:'Eric Sorensen',p:'D',d:17,w:'sorensen'}
  ],
  'IN': [
    {n:'Frank Mrvan',p:'D',d:1,w:'mrvan'},
    {n:'Rudy Yakym',p:'R',d:2,w:'yakym'},
    {n:'Marlin Stutzman',p:'R',d:3,w:'stutzman'},
    {n:'Jim Baird',p:'R',d:4,w:'baird'},
    {n:'Victoria Spartz',p:'R',d:5,w:'spartz'},
    {n:'Greg Pence',p:'R',d:6,w:'pence'},
    {n:'Andre Carson',p:'D',d:7,w:'carson'},
    {n:'Mark Messmer',p:'R',d:8,w:'messmer'},
    {n:'Erin Houchin',p:'R',d:9,w:'houchin'}
  ],
  'IA': [
    {n:'Mariannette Miller-Meeks',p:'R',d:1,w:'millermeeks'},
    {n:'Ashley Hinson',p:'R',d:2,w:'hinson'},
    {n:'Zach Nunn',p:'R',d:3,w:'nunn'},
    {n:'Randy Feenstra',p:'R',d:4,w:'feenstra'}
  ],
  'KS': [
    {n:'Tracey Mann',p:'R',d:1,w:'mann'},
    {n:'Jake LaTurner',p:'R',d:2,w:'laturner'},
    {n:'Sharice Davids',p:'D',d:3,w:'davids'},
    {n:'Ron Estes',p:'R',d:4,w:'estes'}
  ],
  'KY': [
    {n:'James Comer',p:'R',d:1,w:'comer'},
    {n:'Brett Guthrie',p:'R',d:2,w:'guthrie'},
    {n:'Morgan McGarvey',p:'D',d:3,w:'mcgarvey'},
    {n:'Thomas Massie',p:'R',d:4,w:'massie'},
    {n:'Hal Rogers',p:'R',d:5,w:'halrogers'},
    {n:'Andy Barr',p:'R',d:6,w:'barr'}
  ],
  'LA': [
    {n:'Steve Scalise',p:'R',d:1,w:'scalise'},
    {n:'Troy Carter',p:'D',d:2,w:'troycarter'},
    {n:'Clay Higgins',p:'R',d:3,w:'clayhiggins'},
    {n:'Mike Johnson',p:'R',d:4,w:'mikejohnson'},
    {n:'Julia Letlow',p:'R',d:5,w:'letlow'},
    {n:'Garret Graves',p:'R',d:6,w:'garretgraves'}
  ],
  'ME': [
    {n:'Chellie Pingree',p:'D',d:1,w:'pingree'},
    {n:'Jared Golden',p:'D',d:2,w:'golden'}
  ],
  'MD': [
    {n:'Andy Harris',p:'R',d:1,w:'harris'},
    {n:'Dutch Ruppersberger',p:'D',d:2,w:'ruppersberger'},
    {n:'John Sarbanes',p:'D',d:3,w:'sarbanes'},
    {n:'Glenn Ivey',p:'D',d:4,w:'ivey'},
    {n:'Steny Hoyer',p:'D',d:5,w:'hoyer'},
    {n:'April McClain Delaney',p:'D',d:6,w:'mcclaindelaney'},
    {n:'Kweisi Mfume',p:'D',d:7,w:'mfume'},
    {n:'Jamie Raskin',p:'D',d:8,w:'raskin'}
  ],
  'MA': [
    {n:'Richard Neal',p:'D',d:1,w:'neal'},
    {n:'Jim McGovern',p:'D',d:2,w:'mcgovern'},
    {n:'Lori Trahan',p:'D',d:3,w:'trahan'},
    {n:'Jake Auchincloss',p:'D',d:4,w:'auchincloss'},
    {n:'Katherine Clark',p:'D',d:5,w:'katherineclark'},
    {n:'Seth Moulton',p:'D',d:6,w:'moulton'},
    {n:'Ayanna Pressley',p:'D',d:7,w:'pressley'},
    {n:'Stephen Lynch',p:'D',d:8,w:'lynch'},
    {n:'Bill Keating',p:'D',d:9,w:'keating'}
  ],
  'MI': [
    {n:'Jack Bergman',p:'R',d:1,w:'bergman'},
    {n:'John Moolenaar',p:'R',d:2,w:'moolenaar'},
    {n:'Hillary Scholten',p:'D',d:3,w:'scholten'},
    {n:'Bill Huizenga',p:'R',d:4,w:'huizenga'},
    {n:'Tim Walberg',p:'R',d:5,w:'walberg'},
    {n:'Debbie Dingell',p:'D',d:6,w:'debbiedingell'},
    {n:'Curtis Hertel',p:'D',d:7,w:'hertel'},
    {n:'Dan Kildee',p:'D',d:8,w:'dankildee'},
    {n:'Lisa McClain',p:'R',d:9,w:'mcclain'},
    {n:'John James',p:'R',d:10,w:'johnjames'},
    {n:'Haley Stevens',p:'D',d:11,w:'stevens'},
    {n:'Rashida Tlaib',p:'D',d:12,w:'tlaib'},
    {n:'Shri Thanedar',p:'D',d:13,w:'thanedar'}
  ],
  'MN': [
    {n:'Brad Finstad',p:'R',d:1,w:'finstad'},
    {n:'Angie Craig',p:'D',d:2,w:'craig'},
    {n:'Kelly Morrison',p:'D',d:3,w:'morrison'},
    {n:'Betty McCollum',p:'D',d:4,w:'mccollum'},
    {n:'Ilhan Omar',p:'D',d:5,w:'omar'},
    {n:'Tom Emmer',p:'R',d:6,w:'emmer'},
    {n:'Michelle Fischbach',p:'R',d:7,w:'fischbach'},
    {n:'Pete Stauber',p:'R',d:8,w:'stauber'}
  ],
  'MS': [
    {n:'Trent Kelly',p:'R',d:1,w:'trentkelly'},
    {n:'Bennie Thompson',p:'D',d:2,w:'benniethompson'},
    {n:'Michael Guest',p:'R',d:3,w:'guest'},
    {n:'Mike Ezell',p:'R',d:4,w:'ezell'}
  ],
  'MO': [
    {n:'Mark Alford',p:'R',d:4,w:'alford'},
    {n:'Ann Wagner',p:'R',d:2,w:'wagner'},
    {n:'Blaine Luetkemeyer',p:'R',d:3,w:'luetkemeyer'},
    {n:'Emanuel Cleaver',p:'D',d:5,w:'cleaver'},
    {n:'Sam Graves',p:'R',d:6,w:'graves'},
    {n:'Eric Burlison',p:'R',d:7,w:'burlison'},
    {n:'Jason Smith',p:'R',d:8,w:'jasonsmith'},
    {n:'Cori Bush',p:'D',d:1,w:'bush'}
  ],
  'MT': [
    {n:'Ryan Zinke',p:'R',d:1,w:'zinke'},
    {n:'Troy Downing',p:'R',d:2,w:'downing'}
  ],
  'NE': [
    {n:'Mike Flood',p:'R',d:1,w:'flood'},
    {n:'Don Bacon',p:'R',d:2,w:'bacon'},
    {n:'Adrian Smith',p:'R',d:3,w:'adriansmith'}
  ],
  'NV': [
    {n:'Dina Titus',p:'D',d:1,w:'titus'},
    {n:'Mark Amodei',p:'R',d:2,w:'amodei'},
    {n:'Susie Lee',p:'D',d:3,w:'susielee'},
    {n:'Steven Horsford',p:'D',d:4,w:'horsford'}
  ],
  'NH': [
    {n:'Chris Pappas',p:'D',d:1,w:'pappas'},
    {n:'Ann McLane Kuster',p:'D',d:2,w:'kuster'}
  ],
  'NJ': [
    {n:'Donald Norcross',p:'D',d:1,w:'norcross'},
    {n:'Jeff Van Drew',p:'R',d:2,w:'vandrew'},
    {n:'Herb Conaway',p:'D',d:3,w:'conaway'},
    {n:'Chris Smith',p:'R',d:4,w:'chrissmith'},
    {n:'Josh Gottheimer',p:'D',d:5,w:'gottheimer'},
    {n:'Frank Pallone',p:'D',d:6,w:'pallone'},
    {n:'Thomas Kean Jr.',p:'R',d:7,w:'kean'},
    {n:'Rob Menendez',p:'D',d:8,w:'menendez'},
    {n:'Bill Pascrell Jr.',p:'D',d:9,w:'pascrell'},
    {n:'LaMonica McIver',p:'D',d:10,w:'mciver'},
    {n:'Mikie Sherrill',p:'D',d:11,w:'sherrill'},
    {n:'Bonnie Watson Coleman',p:'D',d:12,w:'watsoncoleman'}
  ],
  'NM': [
    {n:'Melanie Stansbury',p:'D',d:1,w:'stansbury'},
    {n:'Gabe Vasquez',p:'D',d:2,w:'vasquez'},
    {n:'Teresa Leger Fernandez',p:'D',d:3,w:'fernandez'}
  ],
  'NY': [
    {n:'Nick LaLota',p:'R',d:1,w:'lalota'},
    {n:'Andrew Garbarino',p:'R',d:2,w:'garbarino'},
    {n:'Tom Suozzi',p:'D',d:3,w:'suozzi'},
    {n:'Anthony D\'Esposito',p:'R',d:4,w:'desposito'},
    {n:'Gregory Meeks',p:'D',d:5,w:'meeks'},
    {n:'Grace Meng',p:'D',d:6,w:'meng'},
    {n:'Nydia Velazquez',p:'D',d:7,w:'velazquez'},
    {n:'Hakeem Jeffries',p:'D',d:8,w:'jeffries'},
    {n:'Yvette Clarke',p:'D',d:9,w:'clarke'},
    {n:'Dan Goldman',p:'D',d:10,w:'goldman'},
    {n:'Mike Lawler',p:'R',d:11,w:'lawler'},
    {n:'Jerry Nadler',p:'D',d:12,w:'nadler'},
    {n:'Adriano Espaillat',p:'D',d:13,w:'espaillat'},
    {n:'Alexandra Ocasio-Cortez',p:'D',d:14,w:'ocasio-cortez'},
    {n:'Ritchie Torres',p:'D',d:15,w:'ritchietorres'},
    {n:'Jamaal Bowman',p:'D',d:16,w:'bowman'},
    {n:'Mondaire Jones',p:'D',d:17,w:'jones'},
    {n:'Pat Ryan',p:'D',d:18,w:'patryan'},
    {n:'Marc Molinaro',p:'R',d:19,w:'molinaro'},
    {n:'Paul Tonko',p:'D',d:20,w:'tonko'},
    {n:'Elise Stefanik',p:'R',d:21,w:'stefanik'},
    {n:'Brandon Williams',p:'R',d:22,w:'brandonwilliams'},
    {n:'Nick Langworthy',p:'R',d:23,w:'langworthy'},
    {n:'Claudia Tenney',p:'R',d:24,w:'tenney'},
    {n:'Joe Morelle',p:'D',d:25,w:'morelle'},
    {n:'Timothy Kennedy',p:'D',d:26,w:'timkennedy'}
  ],
  'NC': [
    {n:'Don Davis',p:'D',d:1,w:'dondavis'},
    {n:'Tim Moore',p:'R',d:2,w:'timmoore'},
    {n:'Greg Murphy',p:'R',d:3,w:'gregmurphy'},
    {n:'Valerie Foushee',p:'D',d:4,w:'foushee'},
    {n:'Virginia Foxx',p:'R',d:5,w:'foxx'},
    {n:'Addison McDowell',p:'R',d:6,w:'mcdowell'},
    {n:'David Rouzer',p:'R',d:7,w:'rouzer'},
    {n:'Dan Bishop',p:'R',d:8,w:'danbishop'},
    {n:'Richard Hudson',p:'R',d:9,w:'hudson'},
    {n:'Patrick McHenry',p:'R',d:10,w:'mchenry'},
    {n:'Chuck Edwards',p:'R',d:11,w:'chuckedwards'},
    {n:'Alma Adams',p:'D',d:12,w:'adams'},
    {n:'Jeff Jackson',p:'D',d:13,w:'jeffjackson'},
    {n:'Tim Moore',p:'R',d:14,w:'timmoore'}
  ],
  'ND': [
    {n:'Kelly Armstrong',p:'R',d:0,w:'armstrong'}
  ],
  'OH': [
    {n:'Greg Landsman',p:'D',d:1,w:'landsman'},
    {n:'Brad Wenstrup',p:'R',d:2,w:'wenstrup'},
    {n:'Joyce Beatty',p:'D',d:3,w:'beatty'},
    {n:'Jim Jordan',p:'R',d:4,w:'jordan'},
    {n:'Bob Latta',p:'R',d:5,w:'latta'},
    {n:'Michael Rulli',p:'R',d:6,w:'rulli'},
    {n:'Max Miller',p:'R',d:7,w:'maxmiller'},
    {n:'Warren Davidson',p:'R',d:8,w:'davidson'},
    {n:'Marcy Kaptur',p:'D',d:9,w:'kaptur'},
    {n:'Michael Turner',p:'R',d:10,w:'turner'},
    {n:'Shontel Brown',p:'D',d:11,w:'shontelbrown'},
    {n:'Troy Balderson',p:'R',d:12,w:'balderson'},
    {n:'Emilia Sykes',p:'D',d:13,w:'sykes'},
    {n:'Dave Joyce',p:'R',d:14,w:'joyce'},
    {n:'Mike Carey',p:'R',d:15,w:'carey'}
  ],
  'OK': [
    {n:'Kevin Hern',p:'R',d:1,w:'hern'},
    {n:'Josh Brecheen',p:'R',d:2,w:'brecheen'},
    {n:'Frank Lucas',p:'R',d:3,w:'lucas'},
    {n:'Tom Cole',p:'R',d:4,w:'cole'},
    {n:'Stephanie Bice',p:'R',d:5,w:'bice'}
  ],
  'OR': [
    {n:'Suzanne Bonamici',p:'D',d:1,w:'bonamici'},
    {n:'Cliff Bentz',p:'R',d:2,w:'bentz'},
    {n:'Earl Blumenauer',p:'D',d:3,w:'blumenauer'},
    {n:'Val Hoyle',p:'D',d:4,w:'hoyle'},
    {n:'Lori Chavez-DeRemer',p:'R',d:5,w:'chavez-deremer'},
    {n:'Andrea Salinas',p:'D',d:6,w:'salinas'}
  ],
  'PA': [
    {n:'Brian Fitzpatrick',p:'R',d:1,w:'fitzpatrick'},
    {n:'Brendan Boyle',p:'D',d:2,w:'boyle'},
    {n:'Dwight Evans',p:'D',d:3,w:'evans'},
    {n:'Madeleine Dean',p:'D',d:4,w:'dean'},
    {n:'Mary Gay Scanlon',p:'D',d:5,w:'scanlon'},
    {n:'Chrissy Houlahan',p:'D',d:6,w:'houlahan'},
    {n:'Susan Wild',p:'D',d:7,w:'wild'},
    {n:'Matt Cartwright',p:'D',d:8,w:'cartwright'},
    {n:'Dan Meuser',p:'R',d:9,w:'meuser'},
    {n:'Scott Perry',p:'R',d:10,w:'perry'},
    {n:'Lloyd Smucker',p:'R',d:11,w:'smucker'},
    {n:'Summer Lee',p:'D',d:12,w:'summerlee'},
    {n:'John Joyce',p:'R',d:13,w:'johnjoyce'},
    {n:'Guy Reschenthaler',p:'R',d:14,w:'reschenthaler'},
    {n:'Glenn Thompson',p:'R',d:15,w:'thompson'},
    {n:'Mike Kelly',p:'R',d:16,w:'mikekelly'},
    {n:'Chris Deluzio',p:'D',d:17,w:'deluzio'}
  ],
  'RI': [
    {n:'Gabe Amo',p:'D',d:1,w:'amo'},
    {n:'Seth Magaziner',p:'D',d:2,w:'magaziner'}
  ],
  'SC': [
    {n:'Nancy Mace',p:'R',d:1,w:'mace'},
    {n:'Joe Wilson',p:'R',d:2,w:'joewilson'},
    {n:'Jeff Duncan',p:'R',d:3,w:'jeffduncan'},
    {n:'William Timmons',p:'R',d:4,w:'timmons'},
    {n:'Ralph Norman',p:'R',d:5,w:'norman'},
    {n:'Jim Clyburn',p:'D',d:6,w:'clyburn'},
    {n:'Russell Fry',p:'R',d:7,w:'fry'}
  ],
  'SD': [
    {n:'Dusty Johnson',p:'R',d:0,w:'dustyjohnson'}
  ],
  'TN': [
    {n:'Diana Harshbarger',p:'R',d:1,w:'harshbarger'},
    {n:'Tim Burchett',p:'R',d:2,w:'burchett'},
    {n:'Chuck Fleischmann',p:'R',d:3,w:'fleischmann'},
    {n:'Scott DesJarlais',p:'R',d:4,w:'desjarlais'},
    {n:'Andy Ogles',p:'R',d:5,w:'ogles'},
    {n:'John Rose',p:'R',d:6,w:'johnrose'},
    {n:'Mark Green',p:'R',d:7,w:'markgreen'},
    {n:'David Kustoff',p:'R',d:8,w:'kustoff'},
    {n:'Steve Cohen',p:'D',d:9,w:'cohen'}
  ],
  'TX': [
    {n:'Nathaniel Moran',p:'R',d:1,w:'moran'},
    {n:'Dan Crenshaw',p:'R',d:2,w:'crenshaw'},
    {n:'Keith Self',p:'R',d:3,w:'self'},
    {n:'Pat Fallon',p:'R',d:4,w:'fallon'},
    {n:'Lance Gooden',p:'R',d:5,w:'gooden'},
    {n:'Jake Ellzey',p:'R',d:6,w:'ellzey'},
    {n:'Lizzie Fletcher',p:'D',d:7,w:'fletcher'},
    {n:'Morgan Luttrell',p:'R',d:8,w:'luttrell'},
    {n:'Al Green',p:'D',d:9,w:'algreen'},
    {n:'Michael McCaul',p:'R',d:10,w:'mccaul'},
    {n:'August Pfluger',p:'R',d:11,w:'pfluger'},
    {n:'Kay Granger',p:'R',d:12,w:'granger'},
    {n:'Ronny Jackson',p:'R',d:13,w:'ronny'},
    {n:'Randy Weber',p:'R',d:14,w:'weber'},
    {n:'Monica De La Cruz',p:'R',d:15,w:'delacruz'},
    {n:'Veronica Escobar',p:'D',d:16,w:'escobar'},
    {n:'Pete Sessions',p:'R',d:17,w:'sessions'},
    {n:'Sheila Jackson Lee',p:'D',d:18,w:'jacksonlee'},
    {n:'Jodey Arrington',p:'R',d:19,w:'arrington'},
    {n:'Joaquin Castro',p:'D',d:20,w:'castro'},
    {n:'Chip Roy',p:'R',d:21,w:'roy'},
    {n:'Troy Nehls',p:'R',d:22,w:'nehls'},
    {n:'Tony Gonzales',p:'R',d:23,w:'gonzales'},
    {n:'Beth Van Duyne',p:'R',d:24,w:'vanduyne'},
    {n:'Roger Williams',p:'R',d:25,w:'williams'},
    {n:'Michael Burgess',p:'R',d:26,w:'burgess'},
    {n:'Michael Cloud',p:'R',d:27,w:'cloud'},
    {n:'Henry Cuellar',p:'D',d:28,w:'cuellar'},
    {n:'Sylvia Garcia',p:'D',d:29,w:'sylviagarcia'},
    {n:'Jasmine Crockett',p:'D',d:30,w:'crockett'},
    {n:'John Carter',p:'R',d:31,w:'carter'},
    {n:'Colin Allred',p:'D',d:32,w:'allred'},
    {n:'Marc Veasey',p:'D',d:33,w:'veasey'},
    {n:'Vicente Gonzalez',p:'D',d:34,w:'gonzalez'},
    {n:'Greg Casar',p:'D',d:35,w:'casar'},
    {n:'Brian Babin',p:'R',d:36,w:'babin'},
    {n:'Lloyd Doggett',p:'D',d:37,w:'doggett'},
    {n:'Wesley Hunt',p:'R',d:38,w:'hunt'}
  ],
  'UT': [
    {n:'Blake Moore',p:'R',d:1,w:'blakemoore'},
    {n:'Celeste Maloy',p:'R',d:2,w:'maloy'},
    {n:'John Curtis',p:'R',d:3,w:'curtis'},
    {n:'Burgess Owens',p:'R',d:4,w:'owens'}
  ],
  'VT': [
    {n:'Becca Balint',p:'D',d:0,w:'balint'}
  ],
  'VA': [
    {n:'Rob Wittman',p:'R',d:1,w:'wittman'},
    {n:'Jen Kiggans',p:'R',d:2,w:'kiggans'},
    {n:'Bobby Scott',p:'D',d:3,w:'bobbyscott'},
    {n:'Jennifer McClellan',p:'D',d:4,w:'mcclellan'},
    {n:'Bob Good',p:'R',d:5,w:'good'},
    {n:'Ben Cline',p:'R',d:6,w:'cline'},
    {n:'Abigail Spanberger',p:'D',d:7,w:'spanberger'},
    {n:'Don Beyer',p:'D',d:8,w:'beyer'},
    {n:'Morgan Griffith',p:'R',d:9,w:'morgangriffith'},
    {n:'Jennifer Wexton',p:'D',d:10,w:'wexton'},
    {n:'Gerry Connolly',p:'D',d:11,w:'connolly'}
  ],
  'WA': [
    {n:'Suzan DelBene',p:'D',d:1,w:'delbene'},
    {n:'Rick Larsen',p:'D',d:2,w:'larsen'},
    {n:'Marie Gluesenkamp Perez',p:'D',d:3,w:'gluesenkampperez'},
    {n:'Dan Newhouse',p:'R',d:4,w:'newhouse'},
    {n:'Cathy McMorris Rodgers',p:'R',d:5,w:'mcmorris'},
    {n:'Derek Kilmer',p:'D',d:6,w:'kilmer'},
    {n:'Pramila Jayapal',p:'D',d:7,w:'jayapal'},
    {n:'Kim Schrier',p:'D',d:8,w:'schrier'},
    {n:'Adam Smith',p:'D',d:9,w:'adamsmith'},
    {n:'Marilyn Strickland',p:'D',d:10,w:'strickland'}
  ],
  'WV': [
    {n:'Carol Miller',p:'R',d:1,w:'carolmiller'},
    {n:'Alex Mooney',p:'R',d:2,w:'mooney'}
  ],
  'WI': [
    {n:'Bryan Steil',p:'R',d:1,w:'steil'},
    {n:'Mark Pocan',p:'D',d:2,w:'pocan'},
    {n:'Derrick Van Orden',p:'R',d:3,w:'vanorden'},
    {n:'Gwen Moore',p:'D',d:4,w:'gwenmoore'},
    {n:'Scott Fitzgerald',p:'R',d:5,w:'fitzgerald'},
    {n:'Glenn Grothman',p:'R',d:6,w:'grothman'},
    {n:'Tom Tiffany',p:'R',d:7,w:'tiffany'},
    {n:'Mike Gallagher',p:'R',d:8,w:'gallagher'}
  ],
  'WY': [
    {n:'Harriet Hageman',p:'R',d:0,w:'hageman'}
  ]
};
