import { Component } from '@angular/core';
import { Article } from '../article';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wrestling',
  templateUrl: './wrestling.component.html',
  styleUrls: ['./wrestling.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class WrestlingComponent {
imageUrl: string = 'assets/baseball.jpeg';
  articles: Article[] = [
    {
      title: 'Mizzou wrestling lands transfer portal, high school commits',
      imageUrl: '/assets/wres.jpeg',
      summary: 'Mizzou wrestling lost a lot of crucial senior experience toward the top of its roster this offseason. Five-time All-American Keegan O’Toole is out of eligibility, and senior Rocky Elam announced his transfer to Iowa State on Tuesday. However, the Tigers are already reloading their roster via the transfer portal. They landed a commitment from three-time NCAA qualifier Maxx Mayfield on Wednesday night. Mayfield previously wrestled at Northwestern and competed in the 165-pound division. He’ll be using his final season of eligibility at Mizzou. The Lincoln, Nebraska, product went 21-12 during his senior season at Northwestern. He had two victories during the NCAA Tournament this season, the first a 7-6 decision over Arizona State’s Nico Ruiz and then a 3-2 tiebreaker over Central Michigan’s Chandler Amaker. On Dec. 29, Mayfield defeated Mizzou redshirt junior Jeremy Jakowitsch by fall in 1 minute, 55 seconds.'

    },
    {
      title: 'Wrestling Finishes NCAA Championships with Two All-Americans',
      imageUrl: 'assets/mat.jpeg',
      summary: 'PHILADELPHIA – No. 25 University of Missouri wrestling closed out the final day of the NCAA Wrestling Championships on March 22 at Wells Fargo Center in 14th place with 32 points. Missouri put two wrestlers on the podium, with redshirt sophomore Cam Steed placing seventh and senior Keegan OToole placing second.'

    },
    {
      title: 'No. 20 Wrestling Falls to No. 3 Oklahoma State',
      imageUrl: 'assets/rest.jpeg',
      summary: 'STILLWATER, Okla. – No. 20 University of Missouri wrestling fell to No. 3 Oklahoma State 36-3 on Sunday. The Tigers dropped to 0-2 on their weekend road trip to the Sooner State. Mizzou now sits at 5-9 (4-3 Big 12) on the season, while Oklahoma State remains undefeated at 12-0 (9-0 Big 12).'

    },
    {
      title: 'Tiger Style Wrestling Takes on 2025 U.S. Open',
      imageUrl: 'assets/wrestling.jpeg',
      summary: 'COLUMBIA, Mo. – University of Missouri wrestling will have four competitors in the 2025 U.S. Open competing under Tiger Style Wrestling Club at The Expo at World Market Center in Las Vegas. The U20 division will take place on April 25-26, with the Senior division competition being held on April 26-27.  Mack Mauger (57kg) and Jarrett Stoner (125kg) will be competing for a U20 freestyle crown, while Jarrett Jacques (74kg) will return to Senior-level competition. Aeoden Sinclair will be doubling up for the weekend, competing at both the U20 and Senior levels. Winners of each Senior-level weight class will earn a spot in Final X on June 14, one step closer to making a Senior World Team. For the U20 division, a high finish will qualify wrestlers for the World Team Trials from May 30 to June 1.'

    },
    // Add more articles here
  ];
}



