import React, { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      "This is a frontend-only demo. Form data:\n" +
        JSON.stringify(form, null, 2)
    );
  };
  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <input
        required
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Full name"
        className="border border-brand-primary/20 rounded-lg px-4 py-3 text-brand-text placeholder-brand-text/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors"
      />
      <input
        required
        name="email"
        value={form.email}
        onChange={handleChange}
        type="email"
        placeholder="Email"
        className="border border-brand-primary/20 rounded-lg px-4 py-3 text-brand-text placeholder-brand-text/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors"
      />
      <textarea
        required
        name="message"
        value={form.message}
        onChange={handleChange}
        rows={5}
        placeholder="Message"
        className="border border-brand-primary/20 rounded-lg px-4 py-3 text-brand-text placeholder-brand-text/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors resize-none"
      />
      <div>
        <button
          type="submit"
          className="bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
        >
          Send Message
        </button>
      </div>
    </form>
  );
}
