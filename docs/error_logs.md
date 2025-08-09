}
 POST /api/projects 500 in 6349ms
[2025-08-09T22:22:26.750Z]  @firebase/firestore: Firestore (12.1.0): GrpcConnection RPC 'Write' stream 0x2c49aa38 error. Code: 7 Message: 7 PERMISSION_DENIED: Missing or insufficient permissions.
Error creating project: [Error [FirebaseError]: 7 PERMISSION_DENIED: Missing or insufficient permissions.] {
  code: 'permission-denied',
  customData: undefined,
  toString: [Function (anonymous)]
}
Failed to write log: [Error [FirebaseError]: Function addDoc() called with invalid data. Unsupported field value: undefined (found in field projectId in document logs/Z45j2HoOwRj9TW2GgdQi)] {
  code: 'invalid-argument',
  customData: undefined,
  toString: [Function (anonymous)]
}
 POST /api/projects 500 in 409ms
