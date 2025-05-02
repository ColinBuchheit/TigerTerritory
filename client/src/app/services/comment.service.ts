import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Comment {
  id?: string;
  postId: string;
  text: string;
  user?: string;
  date?: string;
  author?: string;
  authorEmail?: string;
}

export interface CommentResponse {
  success: boolean;
  message: string;
  data: any;
  timestamp: string;
}

export interface CommentListResponse {
  success: boolean;
  message: string;
  data: {
    comments: Comment[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    }
  };
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = `${environment.apiUrl}/comments`;

  constructor(private http: HttpClient) { }

  /**
   * Get all comments for a specific post
   */
  getCommentsByPostId(postId: string, page: number = 1, limit: number = 10): Observable<CommentListResponse> {
    return this.http.get<CommentListResponse>(`${this.apiUrl}/${postId}?page=${page}&limit=${limit}`);
  }

  /**
   * Add a new comment
   */
  addComment(comment: Comment): Observable<CommentResponse> {
    return this.http.post<CommentResponse>(`${this.apiUrl}/${comment.postId}`, { text: comment.text });
  }

  /**
   * Update an existing comment
   */
  updateComment(commentId: string, text: string): Observable<CommentResponse> {
    return this.http.put<CommentResponse>(`${this.apiUrl}/${commentId}`, { text });
  }

  /**
   * Delete a comment
   */
  deleteComment(commentId: string): Observable<CommentResponse> {
    return this.http.delete<CommentResponse>(`${this.apiUrl}/${commentId}`);
  }
  
  /**
   * Get all comments (admin only)
   */
  getAllComments(page: number = 1, limit: number = 20): Observable<CommentListResponse> {
    return this.http.get<CommentListResponse>(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }
}