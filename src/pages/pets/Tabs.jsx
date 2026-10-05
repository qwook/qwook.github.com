function Tab({ selected, onSelected, children }) {
  return (
    <span
      style={{
        color: selected ? "black" : "blue",
        textDecoration: selected ? null : "underline",
        cursor: "pointer",
        fontWeight: selected ? "bold" : "normal",
        userSelect: "none",
      }}
      onClick={onSelected}
    >
      {children}
    </span>
  );
}

export default function Tabs({ tabs, currentTab, onTabChange }) {
  return (
    <div>
      {tabs.map((tab, idx) => (
        <span key={tab.id}>
          <Tab
            selected={currentTab === tab.id}
            onSelected={() => onTabChange(tab.id)}
          >
            {tab.text}
          </Tab>
          {idx !== tabs.length - 1 ? " | " : null}
        </span>
      ))}
    </div>
  );
}
