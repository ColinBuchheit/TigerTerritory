import { Component } from '@angular/core';
import { Article } from '../article';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-football',
  templateUrl: './football.component.html',
  styleUrls: ['./football.component.css'],
  standalone: true,
  imports: [CommonModule]

})
export class FootballComponent {
imageUrl: string = 'assets/baseball.jpeg';
  articles: Article[] = [
    {
      title: 'No. 21 Missouri Retains Battle Line Rivalry Trophy with 28-21 victory over Arkansas',
      imageUrl: '/assets/drink.jpeg',
      summary: 'COLUMBIA, Mo. – No. 21 Missouri turned two fumbles – both forced by Johnny Walker Jr. – into touchdowns and Marcus Carroll ran for 90 yards and two touchdowns to spark a 28-21 victory over Arkansas in the Battle Line Rivalry, sponsored by Shelter Insurance. With the victory, Missouri (9-3, 5-3) retained the Battle Line Trophy for the eighth time in the last nine years – including the last three – and kept Arkansas (6-6, 3-5) winless in Columbia (0-7). On a cold and snowy day, Missouri won its 10th straight home game, completed its first 7-0 home season and posted its first back-to-back nine-win seasons since 2013-14.'

    },
    {
      title: 'Mizzou football grabs an offensive lineman out of the portal',
      imageUrl: 'assets/luther.jpeg',
      summary: 'Mizzou football coach Eli Drinkwitz has used the spring transfer window to make three new additions to his roster, so far, ahead of the 2025 campaign. On Tuesday, the Tigers gained a commitment from former Florida State offensive lineman Jaylen Early, who will come into Columbia with two years of eligibility. The 6-foot-4, 305-pound lineman started in seven games through 17 appearances for the Seminoles. He played a role in a Florida State offense that averaged 4.4 yards per play and 270.3 yards per game, despite the struggles of a 2-10 season in 2024. The Duncanville, Texas native came out of high school as a consensus four-star prospect, as ESPN tabbed him as the No. 6 offensive guard in the nation and 48th overall prospect from Texas. He played both tackle and guard during his four years at Duncanville High School, where his team reached the 6A D1 state championship game in 2021. In his senior season, the Panthers averaged 47.4 points per game.'

    },
    {
      title: 'No. 7 Missouri opens SEC play with 30-27 Double OT win vs. Vanderbilt',
      imageUrl: 'assets/foot.jpeg',
      summary: 'COLUMBIA, Mo. – A 25-yard touchdown pass from Brady Cook to Luther Burden III and a 37-yard field by Blake Craig allowed the No. 7 Missouri Tigers (4-0, 1-0) to prevail in double overtime, 30-27, against the Vanderbilt Commodores (2-2, 0-1) in the Southeastern Conference opener for both teams. The victory was not secured until Vanderbilts Brock Taylor missed a 31-yard field goal that he hooked left from the right hash mark on the Commodores second OT possession. With the win, Mizzou extended its winning streak to eight games, the nations longest, and the longest for the Tigers since a 13-game streak spanned the 1960 and 1961 seasons.'

    },
    {
      title: 'No. 23 Missouri rallies from 10 down, beats Iowa 27-24 in the Music City Bowl',
      imageUrl: 'assets/cody.jpeg',
      summary: '2NASHVILLE, Tenn. -- — Blake Craig kicked two field goals in the fourth quarter, his second a 56-yarder with 4:36 left as No. 23 Missouri rallied to beat Iowa 27-24 on Monday in the Music City Bowl. Missouri trailed 24-14 when the Tigers started the comeback, scoring the final 13 points for the win. Brady Cook threw for 287 yards and two touchdowns. Joshua Manning also ran for a TD to key the comeback. Marquis Johnson added 122 yards receiving and a TD catch. Missouri (10-3) posted the programs eighth 10-win season. Coach Eli Drinkwitz said the win total is only a piece, with the Tigers starting and finishing the season ranked a great accomplishment for his seniors. “It’s something that they should take a lot of pride in back-to-back seasons," Drinkwitz said. "Finishing ranked is an unbelievable accomplishment for our program and really, really proud of them.”'

    },
    // Add more articles here
  ];
}


