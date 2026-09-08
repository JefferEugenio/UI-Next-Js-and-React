export default function Button({ children, variant = "primary", ...props }) {
  const styles = {
    primary: "bg-ink text-white hover:bg-[#23352e]",
    secondary: "border border-line bg-white text-ink hover:bg-mist",
  };

  return (
    <button
      type="button"
      className={`inline-flex min-h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold transition-colors ${styles[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}
