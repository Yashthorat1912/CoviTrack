package com.example.backend.controller;

import com.example.backend.model.Contact;
import com.example.backend.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
@RequestMapping("/api/contacts")
public class ContactController {
  @Autowired
  private ContactService contactService;

  @PostMapping
  public ResponseEntity<Contact> submitContact(@RequestBody Contact contact) {
    Contact savedContact = contactService.saveContact(contact);
    return ResponseEntity.ok(savedContact);
  }

  @GetMapping
  public ResponseEntity<List<Contact>> getAllContacts() {
    List<Contact> contacts = contactService.getAllContacts();
    return ResponseEntity.ok(contacts);
  }
}
