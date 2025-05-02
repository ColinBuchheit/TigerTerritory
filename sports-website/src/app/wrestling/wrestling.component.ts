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
  selector: 'app-wrestling',
  templateUrl: './wrestling.component.html',
  styleUrls: ['./wrestling.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class WrestlingComponent implements OnInit, OnDestroy {
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
      title: 'Mizzou wrestling lands transfer portal, high school commits',
      imageUrl: '/assets/wres.jpeg',
      summary: 'Mizzou wrestling lost a lot of crucial senior experience toward the top of its roster this offseason, but the Tigers are already reloading their roster via the transfer portal.',
      content: [
        'Mizzou wrestling lost a lot of crucial senior experience toward the top of its roster this offseason. Five-time All-American Keegan OToole is out of eligibility, and senior Rocky Elam announced his transfer to Iowa State on Tuesday.',
        'However, the Tigers are already reloading their roster via the transfer portal. They landed a commitment from three-time NCAA qualifier Maxx Mayfield on Wednesday night. Mayfield previously wrestled at Northwestern and competed in the 165-pound division. He will be using his final season of eligibility at Mizzou.',
        'The Lincoln, Nebraska, product went 21-12 during his senior season at Northwestern. He had two victories during the NCAA Tournament this season, the first a 7-6 decision over Arizona State\'s Nico Ruiz and then a 3-2 tiebreaker over Central Michigan\'s Chandler Amaker.',
        'On Dec. 29, Mayfield defeated Mizzou redshirt junior Jeremy Jakowitsch by fall in 1 minute, 55 seconds.',
        'Mizzou also secured commitments from two highly-touted high school wrestlers, including four-star prospect Trey Crawford from Oklahoma and Illinois state champion Giovanni Cassioppi.'
      ],
      date: 'April 24, 2025',
      category: 'Recruitment',
      postId: 'wrestling-news-1'
    },
    {
      title: 'Wrestling Finishes NCAA Championships with Two All-Americans',
      imageUrl: 'assets/mat.jpeg',
      summary: 'PHILADELPHIA – No. 25 University of Missouri wrestling closed out the final day of the NCAA Wrestling Championships in 14th place with 32 points. Missouri put two wrestlers on the podium.',
      content: [
        'PHILADELPHIA – No. 25 University of Missouri wrestling closed out the final day of the NCAA Wrestling Championships on March 22 at Wells Fargo Center in 14th place with 32 points.',
        'Missouri put two wrestlers on the podium, with redshirt sophomore Cam Steed placing seventh and senior Keegan OToole placing second.',
        'OToole, who entered the tournament as the No. 1 seed at 165 pounds, fell in a hard-fought championship match to Penn State\'s Mitchell Mesenbrink by a 7-5 decision. OToole finishes his illustrious Missouri career as a five-time All-American with one NCAA title.',
        'Steed, seeded 10th at 141 pounds, battled back through the consolation bracket after a quarterfinal loss to earn his first All-American honor. He defeated Nebraska\'s Brock Hardy 6-3 in the seventh-place match.',
        'The Tigers 14th place finish marks their 12th consecutive year finishing in the top 15 at the NCAA Championships under head coach Brian Smith.'
      ],
      date: 'March 23, 2025',
      category: 'Tournament',
      postId: 'wrestling-news-2'
    },
    {
      title: 'No. 20 Wrestling Falls to No. 3 Oklahoma State',
      imageUrl: 'assets/rest.jpeg',
      summary: 'STILLWATER, Okla. – No. 20 University of Missouri wrestling fell to No. 3 Oklahoma State 36-3 on Sunday. The Tigers dropped to 0-2 on their weekend road trip to the Sooner State.',
      content: [
        'STILLWATER, Okla. – No. 20 University of Missouri wrestling fell to No. 3 Oklahoma State 36-3 on Sunday. The Tigers dropped to 0-2 on their weekend road trip to the Sooner State.',
        'Mizzou now sits at 5-9 (4-3 Big 12) on the season, while Oklahoma State remains undefeated at 12-0 (9-0 Big 12).',
        'TIGERS TOP PERFORMER: Keegan OToole earned Missouri\'s lone victory of the dual with a 7-3 decision over Izzak Olejnik at 165 pounds. The win improved OToole to 18-0 on the season with six major decisions, five technical falls and two pins.',
        'The Cowboys won the other nine bouts, including two by fall, two by technical fall and three by major decision.',
        'Missouri will return home for their final regular season dual meet of the year, hosting Northern Iowa on Saturday, February 24, for Senior Day.'
      ],
      date: 'February 18, 2025',
      category: 'Dual Meet',
      postId: 'wrestling-news-3'
    },
    {
      title: 'Tiger Style Wrestling Takes on 2025 U.S. Open',
      imageUrl: 'assets/wrestling.jpeg',
      summary: 'COLUMBIA, Mo. – University of Missouri wrestling will have four competitors in the 2025 U.S. Open competing under Tiger Style Wrestling Club at The Expo at World Market Center in Las Vegas.',
      content: [
        'COLUMBIA, Mo. – University of Missouri wrestling will have four competitors in the 2025 U.S. Open competing under Tiger Style Wrestling Club at The Expo at World Market Center in Las Vegas.',
        'The U20 division will take place on April 25-26, with the Senior division competition being held on April 26-27.',
        'Mack Mauger (57kg) and Jarrett Stoner (125kg) will be competing for a U20 freestyle crown, while Jarrett Jacques (74kg) will return to Senior-level competition.',
        'Aeoden Sinclair will be doubling up for the weekend, competing at both the U20 and Senior levels. Winners of each Senior-level weight class will earn a spot in Final X on June 14, one step closer to making a Senior World Team.',
        'For the U20 division, a high finish will qualify wrestlers for the World Team Trials from May 30 to June 1.',
        'Jacques, a former four-time NCAA qualifier for the Tigers (2019-22), earned a fourth-place finish at the 2023 U.S. Open and will be looking to improve upon that result this year.'
      ],
      date: 'April 20, 2025',
      category: 'U.S. Open',
      postId: 'wrestling-news-4'
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