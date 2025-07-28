class Message {
  String id;
  String text;
  DateTime timestamp;
  bool isFromUser;
  bool isRead;

  Message({
    required this.id,
    required this.text,
    required this.timestamp,
    required this.isFromUser,
    this.isRead = false,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'text': text,
      'timestamp': timestamp.toIso8601String(),
      'isFromUser': isFromUser,
      'isRead': isRead,
    };
  }

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      id: json['id'],
      text: json['text'],
      timestamp: DateTime.parse(json['timestamp']),
      isFromUser: json['isFromUser'],
      isRead: json['isRead'] ?? false,
    );
  }
}
