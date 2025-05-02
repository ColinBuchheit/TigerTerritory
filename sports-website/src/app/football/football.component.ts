import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CommentService, Comment as CommentModel } from '../services/comment.service';
import { Subscription } from 'rxjs';

interface Article {
  id: number;
  title: string;
  imageUrl: string;
  excerpt: string;
  content: string[];
  date: string;
  category: string;
  postId: string; // Identifier for the backend
}

@Component({
  selector: 'app-football',
  templateUrl: './football.component.html',
  styleUrls: ['./football.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class FootballComponent implements OnInit, OnDestroy {
  expandedArticle: number | null = null;
  activeCommentSection: number | null = null;
  newComments: string[] = [];
  imageLoaded: boolean[] = [];
  comments: CommentModel[] = [];
  isLoadingComments: boolean = false;
  commentError: string | null = null;
  private subscriptions: Subscription[] = [];
  
  // Sample articles data with postId for backend
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
      category: 'Game Recap',
      postId: 'football-news-1'
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
      category: 'Recruitment',
      postId: 'football-news-2'
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
      category: 'Game Recap',
      postId: 'football-news-3'
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
      category: 'Bowl Game',
      postId: 'football-news-4'
    }
  ];
  
  constructor(
    private authService: AuthService,
    private commentService: CommentService
  ) {}
  
  ngOnInit(): void {
    // Initialize image loaded states
    this.imageLoaded = this.articles.map(() => false);
    
    // Initialize new comments array
    this.newComments = this.articles.map(() => '');
    
    // Load comments for all articles
    this.articles.forEach(article => {
      this.loadComments(article.postId);
    });
  }
  
  // Load comments from backend
  loadComments(postId: string): void {
    this.isLoadingComments = true;
    
    const subscription = this.commentService.getCommentsByPostId(postId).subscribe({
      next: (response) => {
        if (response.success) {
          // Add comments from this post to the overall comments array
          this.comments = [...this.comments, ...response.data.comments];
        }
        this.isLoadingComments = false;
      },
      error: (error) => {
        console.error('Error loading comments:', error);
        this.commentError = 'Failed to load comments. Please try again later.';
        this.isLoadingComments = false;
      }
    });
    
    this.subscriptions.push(subscription);
  }
  
  // Helper function to safely check if comment has text
  hasCommentText(index: number): boolean {
    return !!this.newComments[index] && this.newComments[index].trim().length > 0;
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
  
  getArticleComments(articleId: number): CommentModel[] {
    const postId = this.articles[articleId].postId;
    return this.comments.filter(comment => comment.postId === postId);
  }
  
  getCommentCount(articleId: number): number {
    return this.getArticleComments(articleId).length;
  }
  
  addComment(articleId: number): void {
    if (!this.hasCommentText(articleId)) {
      return;
    }
    
    // Check if user is authenticated
    if (!this.authService.isLoggedIn()) {
      alert('Please sign in to leave a comment.');
      return;
    }
    
    const postId = this.articles[articleId].postId;
    
    // Create new comment
    const newComment: CommentModel = {
      postId: postId,
      text: this.newComments[articleId]
    };
    
    // Send to backend
    const subscription = this.commentService.addComment(newComment).subscribe({
      next: (response) => {
        if (response.success) {
          // If the backend returns the full comment with user info
          if (response.data) {
            this.comments.push(response.data);
          } else {
            // Otherwise create a temporary comment to display
            const tempComment: CommentModel = {
              id: `temp-${Date.now()}`,
              postId: postId,
              text: this.newComments[articleId],
              author: this.authService.getCurrentUserName(),
              authorEmail: this.authService.getCurrentUserEmail(),
              date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            };
            this.comments.push(tempComment);
          }
          
          // Clear input
          this.newComments[articleId] = '';
        } else {
          alert(response.message || 'Failed to add comment');
        }
      },
      error: (error) => {
        console.error('Error adding comment:', error);
        alert('Failed to add comment. Please try again later.');
      }
    });
    
    this.subscriptions.push(subscription);
  }
  
  // Generate consistent colors for user avatars based on email or name
  getAvatarColor(username: string, email?: string): string {
    const colors = [
      '#F1B82D', // Mizzou Gold
      '#1E88E5', // Blue
      '#43A047', // Green
      '#E53935', // Red
      '#8E24AA', // Purple
      '#FB8C00'  // Orange
    ];
    
    // Use email if available for more uniqueness, otherwise fall back to username
    const stringToHash = email || username;
    
    // Simple hash function to get consistent colors
    let hash = 0;
    for (let i = 0; i < stringToHash.length; i++) {
      hash = stringToHash.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Get color from the array
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }
  
  // Public method to check if user is logged in
  // This avoids direct template access to private authService
  isUserLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  
  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
