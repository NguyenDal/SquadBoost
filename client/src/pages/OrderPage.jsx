import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../App.css";

function OrderPage() {
  const navigate = useNavigate();
  const { serviceId } = useParams();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    currentRank: "Silver I",
    desiredRank: "Gold IV",
    currentLP: "0-20 LP",
    peakRank: "Unranked",
    desiredWins: "5",
    placementGames: "5",
    preferredRole: "Mid",
    numberOfGames: "3",
    region: "North America",
    queueType: "Solo/Duo",
    notes: "",
    priorityOrder: false,
    duoWithBooster: false,
    liveStream: false,
    appearOffline: false,
    championsRoles: false,
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/services/${serviceId}`);

        if (!response.ok) {
          throw new Error("Failed to load service");
        }

        const data = await response.json();
        const normalizedService = data.service || data;
        setService(normalizedService);
      } catch (error) {
        setError("Could not load this service");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  const serviceType = service?.title || "";

  const basePrice = useMemo(() => {
    if (serviceType === "Rank Boost") {
      const rankSteps = getRankStepDifference(
        formData.currentRank,
        formData.desiredRank
      );
      return 12 + rankSteps * 6;
    }

    if (serviceType === "Placement Boost") {
      return 10 + Number(formData.placementGames) * 2;
    }

    if (serviceType === "Win Boost") {
      return 8 + Number(formData.desiredWins) * 2.5;
    }

    if (serviceType === "Hire a Teammate") {
      return 7 + Number(formData.numberOfGames) * 3;
    }

    return 10;
  }, [
    serviceType,
    formData.currentRank,
    formData.desiredRank,
    formData.placementGames,
    formData.desiredWins,
    formData.numberOfGames,
  ]);

  const addonPrice = useMemo(() => {
    let total = 0;
    if (formData.priorityOrder) total += 5;
    if (formData.duoWithBooster) total += 6;
    if (formData.liveStream) total += 3;
    if (formData.championsRoles) total += 2;
    return total;
  }, [
    formData.priorityOrder,
    formData.duoWithBooster,
    formData.liveStream,
    formData.championsRoles,
  ]);

  const totalPrice = (basePrice + addonPrice).toFixed(2);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const demoOrder = {
      serviceId: service.id,
      serviceTitle: service.title,
      serviceDescription: service.description || "",
      totalPrice,
      formData,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("demoOrder", JSON.stringify(demoOrder));
    navigate(`/match/${service.id}`);
  };

  if (loading) {
    return (
      <div className="order-page-shell">
        <div className="order-page-container">
          <p className="info-message">Loading service...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="order-page-shell">
        <div className="order-page-container">
          <p className="error-message">{error || "Service not found."}</p>
          <Link to="/" className="secondary-btn details-link-btn">
            Back to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-page-shell">
      <div className="order-page-bg-overlay" />

      <div className="order-page-container">
        <div className="order-page-topbar">
          <Link to="/" className="order-page-brand">
            <div className="brand-icon">S</div>
            <div>
              <p className="brand-title">SquadBoost</p>
              <p className="brand-subtitle">Order Configurator</p>
            </div>
          </Link>

          <Link to="/" className="order-cancel-btn">
            Back
          </Link>
        </div>

        <div className="order-page-header">
          <div>
            <p className="section-label">Configure Your Order</p>
            <h1 className="order-page-title">
              Build your <span>{service.title}</span> request
            </h1>
            <p className="section-description order-page-description">
              This is a polished demo order flow for the SquadBoost portfolio
              project. The structure is inspired by real gaming service
              configurators, but simplified for a beginner full-stack build.
            </p>
          </div>

          <div className="order-header-badges">
            <div className="order-header-badge">Secure demo flow</div>
            <div className="order-header-badge">Live UI concept</div>
          </div>
        </div>

        <form className="order-layout" onSubmit={handleSubmit}>
          <section className="order-form-panel">
            <div className="order-grid">
              <div className="order-field order-field-wide">
                <label>Platform</label>
                <select name="platform" value="League of Legends" disabled>
                  <option>League of Legends</option>
                </select>
              </div>

              <div className="order-field order-field-wide">
                <label>Boost Type</label>
                <select name="boostType" value={service.title} disabled>
                  <option>{service.title}</option>
                </select>
              </div>

              {serviceType === "Rank Boost" && (
                <>
                  <div className="order-field order-field-wide">
                    <label>Current Division</label>
                    <select
                      name="currentRank"
                      value={formData.currentRank}
                      onChange={handleInputChange}
                    >
                      {rankOptions.map((rank) => (
                        <option key={rank} value={rank}>
                          {rank}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="order-field order-field-wide">
                    <label>Desired Division</label>
                    <select
                      name="desiredRank"
                      value={formData.desiredRank}
                      onChange={handleInputChange}
                    >
                      {rankOptions.map((rank) => (
                        <option key={rank} value={rank}>
                          {rank}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="order-field">
                    <label>Current LP</label>
                    <select
                      name="currentLP"
                      value={formData.currentLP}
                      onChange={handleInputChange}
                    >
                      <option>0-20 LP</option>
                      <option>21-40 LP</option>
                      <option>41-60 LP</option>
                      <option>61-80 LP</option>
                      <option>81-99 LP</option>
                    </select>
                  </div>
                </>
              )}

              {serviceType === "Placement Boost" && (
                <>
                  <div className="order-field order-field-wide">
                    <label>Peak Active Rank</label>
                    <select
                      name="peakRank"
                      value={formData.peakRank}
                      onChange={handleInputChange}
                    >
                      <option>Unranked</option>
                      {rankOptions.map((rank) => (
                        <option key={rank} value={rank}>
                          {rank}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="order-field order-field-wide">
                    <label>Placement Games</label>
                    <select
                      name="placementGames"
                      value={formData.placementGames}
                      onChange={handleInputChange}
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </select>
                  </div>
                </>
              )}

              {serviceType === "Win Boost" && (
                <>
                  <div className="order-field order-field-wide">
                    <label>Current Division</label>
                    <select
                      name="currentRank"
                      value={formData.currentRank}
                      onChange={handleInputChange}
                    >
                      {rankOptions.map((rank) => (
                        <option key={rank} value={rank}>
                          {rank}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="order-field order-field-wide">
                    <label>Desired Wins</label>
                    <select
                      name="desiredWins"
                      value={formData.desiredWins}
                      onChange={handleInputChange}
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>10</option>
                    </select>
                  </div>
                </>
              )}

              {serviceType === "Hire a Teammate" && (
                <>
                  <div className="order-field order-field-wide">
                    <label>Preferred Role</label>
                    <select
                      name="preferredRole"
                      value={formData.preferredRole}
                      onChange={handleInputChange}
                    >
                      <option>Top</option>
                      <option>Jungle</option>
                      <option>Mid</option>
                      <option>ADC</option>
                      <option>Support</option>
                    </select>
                  </div>

                  <div className="order-field order-field-wide">
                    <label>Number of Games</label>
                    <select
                      name="numberOfGames"
                      value={formData.numberOfGames}
                      onChange={handleInputChange}
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>5</option>
                      <option>10</option>
                    </select>
                  </div>
                </>
              )}

              <div className="order-field">
                <label>Region</label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                >
                  <option>North America</option>
                  <option>Europe West</option>
                  <option>Europe Nordic & East</option>
                  <option>Korea</option>
                </select>
              </div>

              <div className="order-field">
                <label>Queue Type</label>
                <select
                  name="queueType"
                  value={formData.queueType}
                  onChange={handleInputChange}
                >
                  <option>Solo/Duo</option>
                  <option>Flex</option>
                </select>
              </div>
            </div>

            <div className="order-addon-panel">
              <p className="order-panel-title">Optional Add-ons</p>

              <div className="order-addon-grid">
                <label className="order-addon-item">
                  <input
                    type="checkbox"
                    name="duoWithBooster"
                    checked={formData.duoWithBooster}
                    onChange={handleInputChange}
                  />
                  <span>Play with Booster</span>
                </label>

                <label className="order-addon-item">
                  <input
                    type="checkbox"
                    name="priorityOrder"
                    checked={formData.priorityOrder}
                    onChange={handleInputChange}
                  />
                  <span>Priority Order</span>
                </label>

                <label className="order-addon-item">
                  <input
                    type="checkbox"
                    name="liveStream"
                    checked={formData.liveStream}
                    onChange={handleInputChange}
                  />
                  <span>Live Stream</span>
                </label>

                <label className="order-addon-item">
                  <input
                    type="checkbox"
                    name="appearOffline"
                    checked={formData.appearOffline}
                    onChange={handleInputChange}
                  />
                  <span>Appear Offline</span>
                </label>

                <label className="order-addon-item">
                  <input
                    type="checkbox"
                    name="championsRoles"
                    checked={formData.championsRoles}
                    onChange={handleInputChange}
                  />
                  <span>Champions / Roles</span>
                </label>
              </div>
            </div>

            <div className="order-notes-panel">
              <p className="order-panel-title">Additional Notes</p>
              <textarea
                name="notes"
                rows="5"
                placeholder="Add extra instructions for this demo order..."
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>
          </section>

          <aside className="order-summary-panel">
            <p className="section-label">Order Summary</p>
            <h2>{service.title}</h2>
            <p className="section-description">
              {service.description || "No description available."}
            </p>

            <div className="order-summary-list">
              <div className="order-summary-row">
                <span>Region</span>
                <strong>{formData.region}</strong>
              </div>

              <div className="order-summary-row">
                <span>Queue</span>
                <strong>{formData.queueType}</strong>
              </div>

              {serviceType === "Rank Boost" && (
                <div className="order-summary-row">
                  <span>Boost Path</span>
                  <strong>
                    {formData.currentRank} → {formData.desiredRank}
                  </strong>
                </div>
              )}

              {serviceType === "Placement Boost" && (
                <div className="order-summary-row">
                  <span>Placements</span>
                  <strong>{formData.placementGames} Games</strong>
                </div>
              )}

              {serviceType === "Win Boost" && (
                <div className="order-summary-row">
                  <span>Desired Wins</span>
                  <strong>{formData.desiredWins}</strong>
                </div>
              )}

              {serviceType === "Hire a Teammate" && (
                <div className="order-summary-row">
                  <span>Games</span>
                  <strong>{formData.numberOfGames}</strong>
                </div>
              )}
            </div>

            <div className="order-price-box">
              <div className="order-summary-row">
                <span>Base Price</span>
                <strong>${basePrice.toFixed(2)}</strong>
              </div>

              <div className="order-summary-row">
                <span>Add-ons</span>
                <strong>${addonPrice.toFixed(2)}</strong>
              </div>

              <div className="order-summary-total">
                <span>Total Price</span>
                <strong>${totalPrice}</strong>
              </div>
            </div>

            <button type="submit" className="primary-btn order-submit-btn">
              Place Demo Order
            </button>

            <Link to="/" className="order-back-link">
              Back to homepage
            </Link>
          </aside>
        </form>
      </div>
    </div>
  );
}

const rankOptions = [
  "Iron IV",
  "Iron III",
  "Iron II",
  "Iron I",
  "Bronze IV",
  "Bronze III",
  "Bronze II",
  "Bronze I",
  "Silver IV",
  "Silver III",
  "Silver II",
  "Silver I",
  "Gold IV",
  "Gold III",
  "Gold II",
  "Gold I",
  "Platinum IV",
  "Platinum III",
  "Platinum II",
  "Platinum I",
  "Emerald IV",
  "Emerald III",
  "Emerald II",
  "Emerald I",
  "Diamond IV",
  "Diamond III",
  "Diamond II",
  "Diamond I",
];

function getRankStepDifference(currentRank, desiredRank) {
  const currentIndex = rankOptions.indexOf(currentRank);
  const desiredIndex = rankOptions.indexOf(desiredRank);

  if (currentIndex === -1 || desiredIndex === -1 || desiredIndex <= currentIndex) {
    return 1;
  }

  return desiredIndex - currentIndex;
}

export default OrderPage;