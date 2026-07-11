import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.message) newErrors.message = "Message is required";
    if (Object.keys(newErrors).length) return setErrors(newErrors);
    console.log("Form submitted:", formData);
    alert("Thanks for reaching out! We’ll be in touch.");
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-20 md:py-28">
      <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-8 text-white">
        Get in Touch<span className="text-indigo-500">.</span>
      </h1>

      <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-10">
        Have a feature idea, feedback, or a question? Drop us a line. We are always open to collaboration, technical queries, or ideas to refine ZazBlog.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col space-y-1">
          <input
            autoComplete="off"
            type="text"
            name="name"
            placeholder="Your name"
            autoCorrect="off"
            onChange={handleChange}
            className="w-full px-4 py-3 bg-zinc-900/60 border border-zinc-800 text-zinc-100 placeholder:text-zinc-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
          />
          {errors.name && <span className="text-red-400 text-xs mt-1">{errors.name}</span>}
        </div>

        <div className="flex flex-col space-y-1">
          <input
            autoComplete="off"
            type="email"
            name="email"
            placeholder="Email address"
            autoCorrect="off"
            onChange={handleChange}
            className="w-full px-4 py-3 bg-zinc-900/60 border border-zinc-800 text-zinc-100 placeholder:text-zinc-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
          />
          {errors.email && <span className="text-red-400 text-xs mt-1">{errors.email}</span>}
        </div>

        <div className="flex flex-col space-y-1">
          <textarea
            name="message"
            placeholder="Your message — ideas, feedback, bug reports, or inquiries"
            rows="6"
            autoCorrect="off"
            onChange={handleChange}
            className="w-full px-4 py-3 bg-zinc-900/60 border border-zinc-800 text-zinc-100 placeholder:text-zinc-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 resize-y min-h-[120px]"
          />
          {errors.message && <span className="text-red-400 text-xs mt-1">{errors.message}</span>}
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto bg-zinc-100 hover:bg-white text-zinc-950 font-medium py-3 px-6 rounded-lg transition-all active:scale-[0.98] cursor-pointer inline-flex items-center justify-center text-sm"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
