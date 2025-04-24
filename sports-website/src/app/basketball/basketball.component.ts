import { Component } from '@angular/core';
import { Article } from '../article';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-basketball',
  templateUrl: './basketball.component.html',
  styleUrls: ['./basketball.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class BasketballComponent {
imageUrl: string = 'assets/baseball.jpeg';
articles: Article[] = [
  {
    title: 'Mizzou announces Porter signing; Allen reunites with Young at Miami; Marshall joins Georgia Tech',
    imageUrl: '/assets/basket.jpeg',
    summary: 'Missouri mens basketball officially announced the signing of Jevon Porter from the transfer portal Wednesday. Porter reportedly committed to the program from Loyola Marymount on March 27, according to a report from ESPNs Jeff Borzello. The junior forwards signing is the first official announcement from the Tigers four portal additions — including Shawn Phillips Jr., Sebastian Mack and Luke Northweather. "Its great to welcome Jevon back to Columbia and join his hometown team," MU coach Dennis Gates said in a news release. "His family has had a lot of success as Tigers, and its great that Jevon will be able to continue that tradition at Mizzou. Jevon has the ability to be a mismatch on the perimeter with great size and length. He has also has a scoring mentality, and the versatility that he provides will be a key to our teams success next season'

  },
  {
    title: 'Have Missouri basketballs roster needs changed with Marcus Allen in portal? What to know',
    imageUrl: 'assets/basket1.jpeg',
    summary: 'The Tigers April surprise arrived Friday. Freshman wing Marcus Allen, the most-played rookie in Missouri basketballs highly touted, five-player Class of 2024 and among the most promising defensive prospects on the team, entered the transfer portal on Friday after his first season in Columbia. Missouri head coach Dennis Gates had called Allen “probably the most consistent of all the freshmen” during the wing’s rookie year. Allen played 9.2 minutes per contest and averaged 2.6 points and 2.0 rebounds per game. According to CBB Analytics, he had more offensive rebounds per 40 minutes than any other Mizzou player and only trailed big man Josh Gray in defensive rebounds per 40 minutes.'

  },
  {
    title: 'Mens Basketball Takes Down No. 1 Kansas',
    imageUrl: 'assets/ball.jpeg',
    summary: 'COLUMBIA, Mo. - University of Missouri Mens basketball earned its fifth win in school history over the nations No. 1 team, battling to a 76-67 victory over Kansas Sunday afternoon in a front of sold-out crowd of 15,061 at Mizzou Arena. With the win, the Tigers extend their winning streak to eight games, improving to 8-1 on the season. MIZZOU LEADERS: Three Tigers scored in double figures to lead MU to victory. Senior Tamar Bates led the team in scoring with a season-high 29 points, while junior Mark Mitchell added 17 points and a team-leading three blocks. Sophomore Anthony Robinson II posted 11 points to go along with four rebounds and three assists. Bates and Robinson also had a team-leading five steals in the winning effort. Graduate Josh Gray snatched a season-high 10 rebounds, adding in seven points and two assists'

  },
  {
    title: 'Mens Basketball Earns Seasons Second Top-Five Win; Tops Florida',
    imageUrl: 'assets/basketball.jpeg',
    summary: 'Gainesville, Fla. – University of Missouri mens basketball took down its second top-five team of the season, earning an 83-82 road win at No. 5/4 Florida on Tuesday night. The Tigers first road win against a top-five team since 2012, Mizzou improves to 14-3 on the season and 3-1 in SEC play for the first time in program history. The nationally-ranked Gators drop to 15-2 and 2-2 versus league foes. MIZZOU LEADERS: Graduate guard Caleb Grill led the Tigers with 22 points, connecting on 7-of-11 field goals and 6-of-10 from 3-point range. The graduate student set the pace early with 12 first-half points, making his first four triples, and also added three steals and two assists in the winning effort. Overall, four Tigers scored in double figures on the night. Junior Mark Mitchell added 15 points and eight rebounds, while sophomore Anthony Robinson II chipped in a dozen points. Senior Tamar Bates added 10 points, while matching his career high with five steals.'

  },
  // Add more articles here
];
}
