import { useState, useRef, useEffect } from "react";
import { FaRegCommentDots, FaTimes, FaPaperPlane } from "react-icons/fa";
import { Link } from "react-router-dom";
import useChat from "../../../services/useChat";

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  const { chat } = useChat();
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function formatTextToJSX(inputText) {
    // Tách nội dung theo dòng trống
    const lines = inputText.split(/\n+/);

    return lines.map((line, index) => {
      if (line.startsWith("* ")) {
        return <li key={index}>{line.substring(2)}</li>;
      }

      // Xử lý tiêu đề (Ví dụ: "**Tiêu đề**" => <strong>Tiêu đề</strong>)
      if (line.startsWith("**") && line.endsWith("**")) {
        return <h3 key={index}>{line.replace(/\*\*/g, "")}</h3>;
      }

      return <p key={index}>{line}</p>;
    });
  }
  const handleSendMessage = async (e) => {
    e.preventDefault();

    // Clear input message
    setInputMessage("");

    // Nếu message rỗng, không làm gì
    if (!inputMessage.trim()) return;

    // Thêm tin nhắn của người dùng vào state
    setMessages([...messages, { text: inputMessage, isBot: false }]);

    // Thêm tin nhắn loading với "..."
    const loadingMessage = { text: "...", isBot: true };
    setMessages((prev) => [
      ...prev,
      loadingMessage, // Tin nhắn loading
    ]);

    // Đợi phản hồi từ API
    const response = await chat(inputMessage.trim());
    const reply = response.reply;

    // Sau khi nhận được phản hồi, thay đổi trạng thái và hiển thị kết quả thực sự
    let updatedMessages = [...messages, { text: inputMessage, isBot: false }];

    if (Array.isArray(reply) && reply.length > 0) {
      updatedMessages = [
        ...updatedMessages,
        ...reply
          .filter((item) => item.name && item.description)
          .map((item) => ({
            text: (
              <Link to={item.packageUrl}>
                <div className="hover:underline">name: {item.name}</div>
                <div className="hover:underline">
                  description: {item.description}
                </div>
              </Link>
            ),
            isBot: true,
          })),
      ];
    } else if (reply) {
      updatedMessages = [
        ...updatedMessages,
        {
          text: formatTextToJSX(reply.toString()), // Đảm bảo là string
          isBot: true,
        },
      ];
    }

    // Lọc bỏ tin nhắn "..."
    updatedMessages = updatedMessages.filter(
      (message) => message.text !== "..."
    );

    // Cập nhật lại state với tin nhắn mới đã xử lý
    setMessages(updatedMessages);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#b91c1c] hover:bg-[#6c1010] text-white rounded-full  p-4 shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#b91c1c] focus:ring-offset-2"
          aria-label="Open chat"
        >
          <FaRegCommentDots className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-80 sm:w-96 h-[32rem] flex flex-col animate-slide-up">
          <div className="bg-[#b91c1c] text-white p-4 rounded-t-lg flex justify-between items-center">
            <h2 className="font-semibold">Chat Support</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white rounded-full"
              aria-label="Close chat"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.isBot ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isBot
                      ? "bg-gray-100 text-gray-800"
                      : "bg-[#b91c1c] text-white"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b91c1c]"
                aria-label="Message input"
              />
              <button
                type="submit"
                className="bg-[#b91c1c] hover:bg-[#6c1010] text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-[#b91c1c] focus:ring-offset-2"
                disabled={!inputMessage.trim()}
                aria-label="Send message"
              >
                <FaPaperPlane className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
