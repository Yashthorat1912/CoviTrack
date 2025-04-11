package com.example.backend.service;

import com.example.backend.model.Contact;
import com.example.backend.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ContactService {
  @Autowired
  private ContactRepository contactRepository;

  public Contact saveContact(Contact contact) {
    return contactRepository.save(contact);
  }

  public List<Contact> getAllContacts() {
    return contactRepository.findAll();
  }
}
