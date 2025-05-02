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
  selector: 'app-baseball',
  templateUrl: './baseball.component.html',
  styleUrls: ['./baseball.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class BaseballComponent implements OnInit, OnDestroy {
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
      title: 'Mizzou Baseball Hosts Missouri State in Exciting Tuesday Game',
      imageUrl: '/assets/baseball.jpeg',
      summary: 'Mizzou baseball kicks off a four-game home stand against Missouri State on Tuesday (April 15) at Taylor Stadium. The Tigers come in with a five-game win streak against MSU.',
      content: [
        'Mizzou baseball kicks off a four-game home stand against Missouri State on Tuesday (April 15) at Taylor Stadium. The Tigers come in with a five-game win streak against MSU, holding a 35-31 all-time series edge.',
        'Mizzou boasts a solid non-conference record of 192-85 since 2014, and will look to keep momentum following a recent 10-9 victory over the Bears in Springfield last week.',
        'The game will be streamed on ESPN+ and featured on the Tiger Radio Network with Tex Little and Matt Michaels calling the action.',
        'Missouri enters the midweek matchup with a 24-16 overall record, including a 15-5 mark in home games this season at Taylor Stadium.',
        "Freshman right-hander Logan Lunceford (2-1, 3.85 ERA) is scheduled to start on the mound for the Tigers against Missouri State's Spencer Nivens (1-0, 2.78 ERA)."
      ],
      date: 'April 15, 2025',
      category: 'Game Preview',
      postId: 'baseball-news-1'
    },
    {
      title: 'Baseball Continues Road Swing with SEC Series Against No. 16 Alabama',
      imageUrl: 'assets/baseballhomepage.jpeg',
      summary: 'TUSCALOOSA, Ala. – University of Missouri baseball makes its first voyage to Tuscaloosa in four years this weekend, as the Tigers square off against No. 16 Alabama Thursday evening at Sewell-Thomas Stadium.',
      content: [
        'TUSCALOOSA, Ala. – University of Missouri baseball makes its first voyage to Tuscaloosa in four years this weekend, as the Tigers square off against No. 16 Alabama Thursday evening at Sewell-Thomas Stadium to open a three-game Southeastern Conference series.',
        'Alabama has won seven-straight games against Mizzou dating back to 2018 and holds a 12-7 overall series edge.',
        'Thursdays contest will be televised live by SEC Network with Derek Jones and Todd Walker handling broadcast duties. Games 2 and 3 of the series will be streamed live on SEC Network+.',
        'The series will also be produced by the Tiger Radio Network for local broadcast on KTGR AM/FM and streamed via the Varsity Network app by searching Missouri, with Tex Little and Matt Michaels on the call.',
        'Mizzou (19-22, 2-16 SEC) will look to bounce back from a tough series against No. 2 Texas A&M last weekend, while Alabama (29-13, 10-8 SEC) is coming off a series win at No. 4 Tennessee.'
      ],
      date: 'April 18, 2025',
      category: 'SEC Series',
      postId: 'baseball-news-2'
    },
    {
      title: 'Depleted Pitching Staff Struggles as Tigers Prepare for Alabama Series',
      imageUrl: '/assets/pitcher.jpeg',
      summary: 'With a depleted pitching staff, the Missouri Tigers are running out of time on the season to get their first conference victory. With four SEC series remaining in the regular season, Mizzou is still winless in league play.',
      content: [
        'With a depleted pitching staff, the Missouri Tigers are running out of time on the season to get their first conference victory. With four SEC series remaining in the regular season, Mizzou is still winless in league play with an 0-18 mark.',
        'The Tigers travel to Tuscaloosa to take on a nationally ranked No. 18 Alabama team under second year head coach Rob Vaughn.',
        'Missouri has been plagued by injuries throughout the season, particularly to its pitching staff. The Tigers have lost three weekend starters and several key relievers to various injuries.',
        'Head coach Steve Bieser noted that the team has been forced to piece together pitching plans game by game, often using position players in relief roles.',
        "Despite the pitching woes, the Tigers' offense has shown signs of life, averaging 6.2 runs per game over their last ten contests, though it hasn't been enough to overcome the pitching deficiencies."
      ],
      date: 'April 17, 2025',
      category: 'Team News',
      postId: 'baseball-news-3'
    },
    {
      title: 'Mizzou Baseball Splits Home-and-Home with Missouri State',
      imageUrl: '/assets/short.webp',
      summary: 'One week ago, the Missouri Tigers took a 10-9 win over the Missouri State Bears. It ended with some words between the teams and now the Bears have evened the score with an 11-0 win at home.',
      content: [
        'One week ago, the Missouri Tigers took a 10-9 win over the Missouri State Bears. It ended with some words between the teams and some fire was into the Bears. The Bears kept their scoring going, but Mizzou was just able to record two hits.',
        'Missouri State took a 11-0 win at home and split the home-and-home series with the Tigers. The Bears walked it off with a two-run homer in the eighth inning to end the game early via run rule.',
        'Mizzou ran out a parade of pitchers who have been injured this season. The first one did good, then it went downhill as Missouri State scored in five different innings.',
        'The return of Sam Horn to the mound has been long awaited after it was announced that the pitcher/quarterback would need Tommy John surgery in February 2023. He took the mound to start the game against the Missouri State Bears.',
        'Horn tossed just eight pitches, but got a strikeout and one hit that he turned into a double play. The ball was then handed to right-hander Josh McDevitt to make his first appearance of the season, but he struggled with command allowing 3 runs in 1.2 innings.'
      ],
      date: 'April 10, 2025',
      category: 'Game Recap',
      postId: 'baseball-news-4'
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
