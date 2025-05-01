// Fixed football.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
  articleId: number;
}

interface Article {
  id: number;
  title: string;
  imageUrl: string;
  excerpt: string;
  content: string[];
  date: string;
  category: string;
}

@Component({
  selector: 'app-football',
  templateUrl: './football.component.html',
  styleUrls: ['./football.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class FootballComponent implements OnInit {
  expandedArticle: number | null = null;
  activeCommentSection: number | null = null;
  newComments: string[] = ['', '', '', ''];
  imageLoaded: boolean[] = [false, false, false, false];
  currentUser = { name: 'Tiger Fan', id: 'user-1' }; // In a real app, get this from auth service
  
  // Sample articles data
  articles: Article[] = [
    {
      id: 0,
      title: 'No. 21 Missouri Retains Battle Line Rivalry Trophy with 28-21 victory over Arkansas',
      imageUrl: 'assets/drink.jpeg',
      excerpt: 'COLUMBIA, Mo. - No. 21 Missouri turned two fumbles - both forced by Johnny Walker Jr. - into touchdowns and Marcus Carroll ran for 90 yards and two touchdowns to spark a 28-21 victory over Arkansas in the Battle Line Rivalry, sponsored by Shelter Insurance.',
      content: [
        'With the victory, Missouri (9-3, 5-3) retained the Battle Line Trophy for the eighth time in the last nine years – including the last three – and kept Arkansas (6-6, 3-5) winless in Columbia (0-7).',
        'On a cold and snowy day, Missouri won its 10th straight home game, completed its first 7-0 home season and posted its first back-to-back nine-win seasons since 2013-14.',
        'Missouri\'s defense forced three Arkansas turnovers, converting Walker\'s two forced fumbles into touchdown drives. Mizzou trailed twice in the game – including 14-7 at halftime – but forged ahead for good on an 11-yard rushing score by Carroll with 11:43 to play that capped a 12-play, 77-yard drive.'
      ],
      date: 'May 1, 2025',
      category: 'Game Recap'
    },
    {
      id: 1,
      title: 'Mizzou football grabs an offensive lineman out of the portal',
      imageUrl: 'assets/luther.jpeg',
      excerpt: 'Mizzou football coach Eli Drinkwitz has used the spring transfer window to make three new additions to his roster, so far, ahead of the 2025 campaign. On Tuesday, the Tigers gained a commitment from former Florida State offensive lineman Jaylen Early, who will come into Columbia with two years of eligibility.',
      content: [
        'The 6-foot-4, 305-pound lineman started in seven games through 17 appearances for the Seminoles. He played a role in a Florida State offense that averaged 4.4 yards per play and 270.3 yards per game, despite the struggles of a 2-10 season in 2024.',
        'The Duncanville, Texas native came out of high school as a consensus four-star prospect, as ESPN tabbed him as the No. 6 offensive guard in the nation and 48th overall prospect from Texas. He played both tackle and guard during his four years at Duncanville High School, where his team reached the 6A D1 state championship game in 2021.',
        'In his senior season, the Panthers averaged 47.4 points per game.'
      ],
      date: 'April 28, 2025',
      category: 'Recruitment'
    },
    {
      id: 2,
      title: 'No. 7 Missouri opens SEC play with 30-27 Double OT win vs. Vanderbilt',
      imageUrl: 'assets/foot.jpeg',
      excerpt: 'COLUMBIA, Mo. – A 25-yard touchdown pass from Brady Cook to Luther Burden III and a 37-yard field by Blake Craig allowed the No. 7 Missouri Tigers (4-0, 1-0) to prevail in double overtime, 30-27, against the Vanderbilt Commodores (2-2, 0-1) in the Southeastern Conference opener for both teams.',
      content: [
        'The victory was not secured until Vanderbilt\'s Brock Taylor missed a 31-yard field goal that he hooked left from the right hash mark on the Commodores\' second OT possession.',
        'With the win, Mizzou extended its winning streak to eight games, the nation\'s longest, and the longest for the Tigers since a 13-game streak spanned the 1960 and 1961 seasons.',
        'Brady Cook completed 27-of-39 passes for 395 yards and two touchdowns. He has now thrown 218 consecutive passes without an interception, a school record.'
      ],
      date: 'April 15, 2025',
      category: 'Game Recap'
    },
    {
      id: 3,
      title: 'No. 23 Missouri rallies from 10 down, beats Iowa 27-24 in the Music City Bowl',
      imageUrl: 'assets/cody.jpeg',
      excerpt: 'NASHVILLE, Tenn. -- — Blake Craig kicked two field goals in the fourth quarter, his second a 56-yarder with 4:36 left as No. 23 Missouri rallied to beat Iowa 27-24 on Monday in the Music City Bowl. Missouri trailed 24-14 when the Tigers started the comeback, scoring the final 13 points for the win.',
      content: [
        'Brady Cook threw for 287 yards and two touchdowns. Joshua Manning also ran for a TD to key the comeback. Marquis Johnson added 122 yards receiving and a TD catch. Missouri (10-3) posted the program\'s eighth 10-win season.',
        'Coach Eli Drinkwitz said the win total is only a piece, with the Tigers starting and finishing the season ranked a great accomplishment for his seniors.',
        '"It\'s something that they should take a lot of pride in back-to-back seasons," Drinkwitz said. "Finishing ranked is an unbelievable accomplishment for our program and really, really proud of them."'
      ],
      date: 'April 10, 2025',
      category: 'Bowl Game'
    }
  ];
  
  // Comments array will be initialized from localStorage
  comments: Comment[] = [];
  
  constructor() {}
  
  ngOnInit(): void {
    // Initialize image loaded states
    this.imageLoaded = this.articles.map(() => false);
    
    // Load comments from localStorage
    this.loadComments();
    
    // If there are no comments (first visit), set up initial comments
    if (this.comments.length === 0) {
      this.setupInitialComments();
    }
  }
  
  // Helper function to safely check if comment has text
  hasCommentText(index: number): boolean {
    return !!this.newComments[index] && this.newComments[index].trim().length > 0;
  }
  
  // Load comments from localStorage
  loadComments(): void {
    const savedComments = localStorage.getItem('football_comments');
    if (savedComments) {
      this.comments = JSON.parse(savedComments);
    }
  }
  
  // Save comments to localStorage
  saveComments(): void {
    localStorage.setItem('football_comments', JSON.stringify(this.comments));
  }
  
  // Initial comment setup
  setupInitialComments(): void {
    this.comments = [
      {
        id: '1',
        author: 'Tiger Fan',
        text: 'Great win for Mizzou! The defense really stepped up when it mattered.',
        date: 'May 1, 2025',
        articleId: 0
      },
      {
        id: '2',
        author: 'SEC4Life',
        text: 'Carroll is having an amazing season. Glad to see the running game so strong.',
        date: 'May 1, 2025',
        articleId: 0
      },
      {
        id: '3',
        author: 'RecruitWatcher',
        text: 'Early is a great addition! We needed depth on the offensive line.',
        date: 'April 28, 2025',
        articleId: 1
      },
      {
        id: '4',
        author: 'Mizzou Alum',
        text: 'What a thriller against Vandy! Cook to Burden is becoming an elite connection.',
        date: 'April 15, 2025',
        articleId: 2
      },
      {
        id: '5',
        author: 'BowlGameExpert',
        text: 'That 56-yard field goal was clutch! Great way to finish the season.',
        date: 'April 10, 2025',
        articleId: 3
      }
    ];
    
    // Save to localStorage
    this.saveComments();
  }
  
  onImageLoad(index: number): void {
    this.imageLoaded[index] = true;
  }
  
  toggleArticle(index: number): void {
    if (this.expandedArticle === index) {
      this.expandedArticle = null;
    } else {
      this.expandedArticle = index;
      // Close comment section when expanding article
      if (this.activeCommentSection === index) {
        this.activeCommentSection = null;
      }
    }
  }
  
  toggleComments(index: number): void {
    if (this.activeCommentSection === index) {
      this.activeCommentSection = null;
    } else {
      this.activeCommentSection = index;
      // Close expanded article when opening comments
      if (this.expandedArticle === index) {
        this.expandedArticle = null;
      }
    }
  }
  
  getArticleComments(articleId: number): Comment[] {
    return this.comments.filter(comment => comment.articleId === articleId);
  }
  
  getCommentCount(articleId: number): number {
    return this.getArticleComments(articleId).length;
  }
  
  addComment(articleId: number): void {
    if (!this.hasCommentText(articleId)) {
      return;
    }
    
    // Create new comment
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: this.currentUser.name,
      text: this.newComments[articleId],
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      articleId: articleId
    };
    
    // Add to comments array
    this.comments.push(newComment);
    
    // Save to localStorage
    this.saveComments();
    
    // Clear input
    this.newComments[articleId] = '';
  }
  
  // Generate consistent colors for user avatars
  getAvatarColor(username: string): string {
    const colors = [
      '#F1B82D', // Mizzou Gold
      '#1E88E5', // Blue
      '#43A047', // Green
      '#E53935', // Red
      '#8E24AA', // Purple
      '#FB8C00'  // Orange
    ];
    
    // Simple hash function to get consistent colors
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Get color from the array
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }
}