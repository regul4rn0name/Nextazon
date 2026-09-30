export function ChatPrivacyNotice() {
  return (
    <aside className="chat-privacy-notice" aria-labelledby="chat-privacy-title">
      <h3 id="chat-privacy-title">Keep your personal information private</h3>
      <p id="chat-privacy-description">
        Messages are not end-to-end encrypted and are stored on our server.
        Don’t share passwords, verification codes, payment details, your address,
        phone number, or other sensitive personal information. Keep conversations
        focused on in-game trades, and be cautious with links from people you don’t know.
      </p>
    </aside>
  );
}
