import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:uuid/uuid.dart';
import 'dart:convert';
import '../models/message.dart';

class MessageService extends ChangeNotifier {
  static const String _messagesKey = 'messages';
  final Uuid _uuid = const Uuid();

  List<Message> _messages = [];
  int _unreadCount = 0;

  List<Message> get messages => _messages;
  int get unreadCount => _unreadCount;

  Future<void> init() async {
    await _loadMessages();
  }

  Future<void> _loadMessages() async {
    final prefs = await SharedPreferences.getInstance();
    final messagesJson = prefs.getStringList(_messagesKey) ?? [];

    _messages =
        messagesJson.map((json) => Message.fromJson(jsonDecode(json))).toList();
    _messages.sort((a, b) => a.timestamp.compareTo(b.timestamp));
    _calculateUnreadCount();
    notifyListeners();
  }

  Future<void> _saveMessages() async {
    final prefs = await SharedPreferences.getInstance();
    final messagesJson =
        _messages.map((message) => jsonEncode(message.toJson())).toList();
    await prefs.setStringList(_messagesKey, messagesJson);
  }

  void _calculateUnreadCount() {
    _unreadCount =
        _messages.where((msg) => !msg.isFromUser && !msg.isRead).length;
  }

  Future<void> sendMessage(String text) async {
    final message = Message(
      id: _uuid.v4(),
      text: text,
      timestamp: DateTime.now(),
      isFromUser: true,
    );

    _messages.add(message);
    await _saveMessages();
    notifyListeners();

    // Simulate support agent response
    _simulateAgentResponse();
  }

  Future<void> _simulateAgentResponse() async {
    final responses = [
      "Thanks for reaching out! How can I help you today?",
      "I understand your concern. Let me look into this for you.",
      "That's a great question! Here's what I can tell you...",
      "I'll need to check with our team and get back to you shortly.",
      "Thanks for the feedback! We really appreciate it.",
      "Is there anything else I can help you with?",
      "Let me transfer you to a specialist who can better assist you.",
      "I've made a note of this issue and will follow up.",
    ];

    // Random delay between 1-3 seconds
    await Future.delayed(
        Duration(seconds: 1 + (DateTime.now().millisecond % 3)));

    final response = Message(
      id: _uuid.v4(),
      text: responses[DateTime.now().millisecond % responses.length],
      timestamp: DateTime.now(),
      isFromUser: false,
    );

    _messages.add(response);
    _calculateUnreadCount();
    await _saveMessages();
    notifyListeners();
  }

  Future<void> markAllAsRead() async {
    for (var message in _messages.where((m) => !m.isFromUser && !m.isRead)) {
      message.isRead = true;
    }
    _unreadCount = 0;
    await _saveMessages();
    notifyListeners();
  }

  Future<void> clearAllMessages() async {
    _messages.clear();
    _unreadCount = 0;
    await _saveMessages();
    notifyListeners();
  }
}
