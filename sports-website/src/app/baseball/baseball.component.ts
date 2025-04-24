import { Component } from '@angular/core';
import { Article } from '../article';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-baseball',
  templateUrl: './baseball.component.html',
  styleUrls: ['./baseball.component.css'],
  standalone: true,
  imports: [CommonModule],

})
export class BaseballComponent {
  imageUrl: string = 'assets/baseball.jpeg';
  articles: Article[] = [
    {
      title: 'Mizzou Baseball Hosts Missouri State in Exciting Tuesday Game',
      imageUrl: '/assets/baseball.jpeg',
      summary: 'Mizzou baseball kicks off a four-game home stand against Missouri State on Tuesday (April 15) at Taylor Stadium. The Tigers come in with a five-game win streak against MSU, holding a 35-31 all-time series edge. Mizzou boasts a solid non-conference record of 192-85 since 2014, and will look to keep momentum following a recent 10-9 victory over the Bears. The game will be streamed on ESPN+ and featured on the Tiger Radio Network.'

    },
    {
      title: 'Baseball Continues Road Swing with SEC Series Against No. 16 Alabama',
      imageUrl: 'assets/baseballhomepage.jpeg',
      summary: 'TUSCALOOSA, Ala. – University of Missouri baseball makes its first voyage to Tuscaloosa in four years this weekend, as the Tigers square off against No. 16 Alabama Thursday evening at Sewell-Thomas Stadium to open a three-game Southeastern Conference series. Alabama has won seven-straight games against Mizzou dating back to 2018 and holds a 12-7 overall series edge.Thursdays contest will be televised live by SEC Network with Derek Jones and Todd Walker handling broadcast duties. Games 2 and 3 of the series will be streamed live on SEC Network+. The series will also be produced by the Tiger Radio Network for local broadcast on KTGR AM/FM and streamed via the Varsity Network app by searching Missouri, with Tex Little and Matt Michaels on the call.'

    },
    {
      title: 'Mizzou Baseball Hosts Missouri State in Exciting Tuesday Game',
      imageUrl: '/assets/pitcher.jpeg',
      summary: 'With a depleted pitching staff, the Missouri Tigers are running out of time on the season to get their first conference victory. With four SEC series remaining in the regular season, Mizzou is still winless in league play with an 0-18 mark. The Tigers travel to Tuscaloosa to take on a nationally ranked No. 18 Alabama team under second year head coach Rob Vaughn.'

    },
    {
      title: 'Mizzou Baseball Splits Home-and-Home with Missouri State',
      imageUrl: '/assets/short.webp',
      summary: 'One week ago, the Missouri Tigers took a 10-9 win over the Missouri State Bears. It ended with some words between the teams and some fire was into the Bears. The Bears kept their scoring going, but Mizzou was just able to record two hits. Missouri State took a 11-0 win at home and split the home-and-home series with the Tigers. The Bears walked it off with a two-run homer. Mizzou ran out a parade of pitchers who have been injured this season. The first one did good, then it went downhill. The return of Sam Horn to the mound has been long awaited after it was announced that the pitcher/quarterback would need Tommy John surgery in February 2023. He took the mound to start the game against the Missouri State Bears. Horn tossed just eight pitches, but got a strikeout and one hit that he turned into a double play. The ball was then handed to right-hander Josh McDevitt to make his first appearance of the season.'

    },
    // Add more articles here
  ];
}
