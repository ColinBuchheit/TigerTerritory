import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CommentService, Comment as CommentModel } from '../services/comment.service';
import { Subscription } from 'rxjs';

interface Article {
  title: string;
  imageUrl: string;
  summary: string;
  content: string[];
  date?: string;
  category?: string;
  postId: string; // Identifier for the backend
}

@Component({
  selector: 'app-basketball',
  templateUrl: './basketball.component.html',
  styleUrls: ['./basketball.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class BasketballComponent implements OnInit, OnDestroy {
  expandedArticle: number | null = null;
  activeCommentSection: number | null = null;
  newComments: string[] = [];
  imageLoaded: boolean[] = [];
  comments: CommentModel[] = [];
  isLoadingComments: boolean = false;
  commentError: string | null = null;
  private subscriptions: Subscription[] = [];
  
  // Modified articles data with postId for backend integration
  articles: Article[] = [
    {
      title: 'Mizzou announces Porter signing; Allen reunites with Young at Miami; Marshall joins Georgia Tech',
      imageUrl: '/assets/basket.jpeg',
      summary: 'Missouri mens basketball officially announced the signing of Jevon Porter from the transfer portal Wednesday. Porter reportedly committed to the program from Loyola Marymount on March 27, according to a report from ESPNs Jeff Borzello.',
      content: [
        'Missouri mens basketball officially announced the signing of Jevon Porter from the transfer portal Wednesday. Porter reportedly committed to the program from Loyola Marymount on March 27, according to a report from ESPNs Jeff Borzello.',
        'The junior forwards signing is the first official announcement from the Tigers four portal additions — including Shawn Phillips Jr., Sebastian Mack and Luke Northweather.',
        '"Its great to welcome Jevon back to Columbia and join his hometown team," MU coach Dennis Gates said in a news release. "His family has had a lot of success as Tigers, and its great that Jevon will be able to continue that tradition at Mizzou. Jevon has the ability to be a mismatch on the perimeter with great size and length. He has also has a scoring mentality, and the versatility that he provides will be a key to our teams success next season."',
        'Porter, a 6-foot-11 forward, averaged 7.1 points, 2.9 rebounds and 1.1 blocks in 19.4 minutes per game over 30 appearances (six starts) as a junior at Loyola Marymount. He shot 47.9% from the field and 31.1% from 3-point range.'
      ],
      date: 'April 24, 2025',
      category: 'Recruitment',
      postId: 'basketball-news-1'
    },
    {
      title: "Have Missouri basketball roster needs changed with Marcus Allen in portal? What to know",
      imageUrl: "assets/basket1.jpeg",
      summary: "The Tigers April surprise arrived Friday. Freshman wing Marcus Allen, the most-played rookie in Missouri basketball highly touted, five-player Class of 2024 and among the most promising defensive prospects on the team, entered the transfer portal.",
      content: [
        "The Tigers April surprise arrived Friday. Freshman wing Marcus Allen, the most-played rookie in Missouri basketball highly touted, five-player Class of 2024 and among the most promising defensive prospects on the team, entered the transfer portal on Friday after his first season in Columbia.",
        "Missouri head coach Dennis Gates had called Allen \"probably the most consistent of all the freshmen\" during the wing's rookie year. Allen played 9.2 minutes per contest and averaged 2.6 points and 2.0 rebounds per game.",
        "According to CBB Analytics, he had more offensive rebounds per 40 minutes than any other Mizzou player and only trailed big man Josh Gray in defensive rebounds per 40 minutes.",
        "Allen was the No. 81 player in the 2023 class per the 247Sports Composite and the fifth-highest-rated recruit to sign with Mizzou since the rankings began in 2003, trailing only Michael Porter Jr., his brother Jontay Porter, Jakeenan Gant and Montaque Gill-Caesar.",
        "His departure leaves the Tigers with three open scholarships for the 2025-26 season. Mizzou has already added 7-foot center Shawn Phillips Jr., 6-foot-11 forward Jevon Porter and combo guard Sebastian Mack from the transfer portal."
      ],
      date: "April 19, 2025",
      category: "Team News",
      postId: "basketball-news-2"
    },
    {
      title: 'Mens Basketball Takes Down No. 1 Kansas',
      imageUrl: 'assets/ball.jpeg',
      summary: 'COLUMBIA, Mo. - University of Missouri Mens basketball earned its fifth win in school history over the nations No. 1 team, battling to a 76-67 victory over Kansas Sunday afternoon in a front of sold-out crowd of 15,061 at Mizzou Arena.',
      content: [
        'COLUMBIA, Mo. - University of Missouri Mens basketball earned its fifth win in school history over the nations No. 1 team, battling to a 76-67 victory over Kansas Sunday afternoon in a front of sold-out crowd of 15,061 at Mizzou Arena.',
        'With the win, the Tigers extend their winning streak to eight games, improving to 8-1 on the season.',
        'MIZZOU LEADERS: Three Tigers scored in double figures to lead MU to victory. Senior Tamar Bates led the team in scoring with a season-high 29 points, while junior Mark Mitchell added 17 points and a team-leading three blocks.',
        'Sophomore Anthony Robinson II posted 11 points to go along with four rebounds and three assists. Bates and Robinson also had a team-leading five steals in the winning effort.',
        'Graduate Josh Gray snatched a season-high 10 rebounds, adding in seven points and two assists.',
        'The Tigers now hold a 147-173 all-time record against Kansas in a rivalry dating back to 1907.'
      ],
      date: 'April 15, 2025',
      category: 'Game Recap',
      postId: 'basketball-news-3'
    },
    {
      title: 'Mens Basketball Earns Seasons Second Top-Five Win; Tops Florida',
      imageUrl: 'assets/basketball.jpeg',
      summary: 'Gainesville, Fla. – University of Missouri mens basketball took down its second top-five team of the season, earning an 83-82 road win at No. 5/4 Florida on Tuesday night.',
      content: [
        'Gainesville, Fla. – University of Missouri mens basketball took down its second top-five team of the season, earning an 83-82 road win at No. 5/4 Florida on Tuesday night.',
        'The Tigers first road win against a top-five team since 2012, Mizzou improves to 14-3 on the season and 3-1 in SEC play for the first time in program history. The nationally-ranked Gators drop to 15-2 and 2-2 versus league foes.',
        'MIZZOU LEADERS: Graduate guard Caleb Grill led the Tigers with 22 points, connecting on 7-of-11 field goals and 6-of-10 from 3-point range. The graduate student set the pace early with 12 first-half points, making his first four triples, and also added three steals and two assists in the winning effort.',
        'Overall, four Tigers scored in double figures on the night. Junior Mark Mitchell added 15 points and eight rebounds, while sophomore Anthony Robinson II chipped in a dozen points. Senior Tamar Bates added 10 points, while matching his career high with five steals.',
        'Florida entered the game with the SECs best 3-point shooting percentage (39.8%), but Mizzou held the Gators to just 8-of-28 (28.6%) from long range.'
      ],
      date: 'April 10, 2025',
      category: 'Game Recap',
      postId: 'basketball-news-4'
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
