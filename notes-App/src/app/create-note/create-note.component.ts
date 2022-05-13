import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Note } from '../models/note';

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrls: ['./create-note.component.scss']
})
export class CreateNoteComponent implements OnInit {

  showText = true;
  notes: Note[] = [];
  formVisible = false;
  noteContent: string = "";
  isEditing = false;
  isBeingEdited: Note | null = null;
  

  constructor(private http: HttpClient) { }

  ngOnInit(): void {

  }

  switchBool(): void {
    this.showText = !this.showText;
  }

  getNotes() {
    this.http.get<Note[]>('/home')
      .subscribe(data => this.notes = data);
  }

  createNote() {
    this.formVisible = true;
  }

  hideNote() {
    this.formVisible = false;
    this.isEditing = false;
    this.noteContent = "";
  }

  submitNote() {
    if (this.isEditing && this.isBeingEdited !== null) {
      this.isBeingEdited.content = this.noteContent;
      this.updateNote(this.isBeingEdited);
      this.noteContent = "";
      this.isEditing = false;
    } else {
    this.http.post('/home', { Note: this.noteContent })
      .subscribe(() => {
        this.noteContent = "";
        this.isEditing = false;
        this.getNotes();
      });
    }
  }

  deleteNote(id:number) {
    this.http.delete(`/home/${id}`)
    .subscribe(() => this.getNotes());
  }

  editNote(note:Note) {
    this.createNote();
    this.isBeingEdited = note;
    this.noteContent = note.content;
    this.isEditing = true;
  }

  updateNote(note:Note) {
    this.http.put(`/home/${note.id}`, note).subscribe();
  }



}
