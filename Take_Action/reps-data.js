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
