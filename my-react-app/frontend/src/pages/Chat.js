import React, { useState } from "react";
import ChatMessage from "../ChatMessage";

function Chat() {
  const [messages, setMessages] = useState([]);

  // Simulate a chatbot response (replace this with your actual chatbot logic)
  const handleChatbotResponse = () => {
    const response = `![](https://quickchart.io/chart?width=400&c=%7B%22type%22%3A%22bar%22%2C%22data%22%3A%7B%22labels%22%3A%5B%22%E0%B8%A1%E0%B8%81%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B8%A1%22%2C%22%E0%B8%81%E0%B8%B8%E0%B8%A1%E0%B8%A0%E0%B8%B2%E0%B8%9E%E0%B8%B1%E0%B8%99%E0%B8%98%E0%B9%8C%22%2C%22%E0%B8%A1%E0%B8%B5%E0%B8%99%E0%B8%B2%E0%B8%84%E0%B8%A1%22%2C%22%E0%B9%80%E0%B8%A1%E0%B8%A9%E0%B8%B2%E0%B8%A2%E0%B8%99%22%2C%22%E0%B8%9E%E0%B8%A4%E0%B8%A9%E0%B8%A0%E0%B8%B2%E0%B8%84%E0%B8%A1%22%2C%22%E0%B8%A1%E0%B8%B4%E0%B8%96%E0%B8%B8%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%99%22%2C%22%E0%B8%81%E0%B8%A3%E0%B8%81%E0%B8%8E%E0%B8%B2%E0%B8%84%E0%B8%A1%22%2C%22%E0%B8%AA%E0%B8%B4%E0%B8%87%E0%B8%AB%E0%B8%B2%E0%B8%84%E0%B8%A1%22%2C%22%E0%B8%81%E0%B8%B1%E0%B8%99%E0%B8%A2%E0%B8%B2%E0%B8%A2%E0%B8%99%22%2C%22%E0%B8%95%E0%B8%B8%E0%B8%A5%E0%B8%B2%E0%B8%84%E0%B8%A1%22%5D%2C%22datasets%22%3A%5B%7B%22label%22%3A%22%E0%B8%A2%E0%B8%AD%E0%B8%94%E0%B8%82%E0%B8%B2%E0%B8%A2%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B9%80%E0%B8%94%E0%B8%B7%E0%B8%AD%E0%B8%99%E0%B8%9B%E0%B8%B5%202012%22%2C%22data%22%3A%5B15806327%2C14714691%2C18120134.4%2C7177199.48%2C10827640%2C6892167.8%2C9085770%2C8925452%2C10614567%2C8363234%5D%2C%22backgroundColor%22%3A%22%23007bff%22%7D%5D%7D%2C%22options%22%3A%7B%22responsive%22%3Atrue%2C%22plugins%22%3A%7B%22legend%22%3A%7B%22display%22%3Atrue%2C%22position%22%3A%22top%22%7D%2C%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22%E0%B8%A2%E0%B8%AD%E0%B8%94%E0%B8%82%E0%B8%B2%E0%B8%A2%E0%B8%A3%E0%B8%B2%E0%B8%A2%E0%B9%80%E0%B8%94%E0%B8%B7%E0%B8%AD%E0%B8%99%E0%B8%9B%E0%B8%B5%202012%22%7D%7D%2C%22scales%22%3A%7B%22y%22%3A%7B%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22%E0%B8%A2%E0%B8%AD%E0%B8%94%E0%B8%82%E0%B8%B2%E0%B8%A2%20(%E0%B8%9A%E0%B8%B2%E0%B8%97)%22%7D%2C%22beginAtZero%22%3Atrue%7D%2C%22x%22%3A%7B%22title%22%3A%7B%22display%22%3Atrue%2C%22text%22%3A%22%E0%B9%80%E0%B8%94%E0%B8%B7%E0%B8%AD%E0%B8%99%22%7D%7D%7D%7D%7D)\n\nจากกราฟแท่งแสดงยอดขายรายเดือนปี 2012 สามารถสรุปได้ดังนี้:\n\n1. ยอดขายสูงสุด 3 อันดับแรก:\n   - มีนาคม: 18,120,134.40 บาท\n   - มกราคม: 15,806,327 บาท\n   - กุมภาพันธ์: 14,714,691 บาท\n\n2. ยอดขายต่ำสุด 3 อันดับ:\n   - มิถุนายน: 6,892,167.80 บาท\n   - เมษายน: 7,177,199.48 บาท\n   - ตุลาคม: 8,363,234 บาท\n\n3. แนวโน้มยอดขาย:\n   - ช่วงไตรมาสแรก (ม.ค.-มี.ค.) มียอดขายสูงที่สุด\n   - มีการลดลงอย่างมากในเดือนเมษายนและมิถุนายน\n   - ยอดขายค่อนข้างทรงตัวในช่วงครึ่งปีหลัง อยู่ในช่วง 8-10 ล้านบาท\n\nต้องการดูข้อมูลเพิ่มเติมในส่วนไหนไหมครับ?`;
    setMessages((prevMessages) => [...prevMessages, { text: response, sender: "bot" }]);
  };

  return (
    <div className="chat-container">
      <div className="chat-window">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message.text} />
        ))}
      </div>
      <button onClick={handleChatbotResponse}>Simulate Chatbot Response</button>
    </div>
  );
}

export default Chat;