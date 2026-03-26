import "./stackcard.css";

export const ChitStack = () => {
  const stackData = [
    { id: 1, title: "Total Groups", value: 18, icon: "fi fi-tr-users" },
    { id: 2, title: "Active Members", value: 245, icon: "fi fi-tr-member-list" },
    { id: 3, title: "Monthly Collection", value: "₹ 4,50,000", icon: "fi fi-tr-coins" },
    { id: 4, title: "Pending Amount", value: "₹ 65,000", icon: "fi fi-tr-money-bill-wave" },
  ];

  return (
    <>
      <div className="stack_details">
        <div className="row gy-4">
          {stackData.map((item, index) => {
            return (
              <div className="col-lg-3 col-md-6 col-12" key={index}>
                <div className="stack_card">
                  <div className="d-flex justify-content-between gap-2">
                    <div className="content">
                      <p className="stack_text">{item.title}</p>
                      <h5 className="stack_title">{item.value}</h5>
                    </div>
                    <div className="icon">
                      <i class={item.icon}></i>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
