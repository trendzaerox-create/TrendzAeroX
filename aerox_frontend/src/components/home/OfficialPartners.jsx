"use client";

const partners = [
  {
    id: 1,
    name: "Amazon",
    image:
      "https://static.vecteezy.com/system/resources/previews/019/766/240/non_2x/amazon-logo-amazon-icon-transparent-free-png.png",
    className: "amazonLogo",
  },
  {
    id: 2,
    name: "Flipkart",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/e/e5/Flipkart_logo_%282026%29.svg",
    className: "flipkartLogo",
  },
];

export default function OfficialPartners() {
  return (
    <section className="officialPartnersSection">
      <h2 className="officialPartnersTitle">Official Partners</h2>

      <div className="partnersLogoRow">
        {partners.map((partner) => (
          <div className="partnerLogoBox" key={partner.id}>
            <img
              src={partner.image}
              alt={partner.name}
              className={`partnerLogo ${partner.className}`}
              draggable="false"
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        .officialPartnersSection {
          width: 100%;
          height: 370px;
          background: #ffffff;
          border-top: 1px solid #e6e6e6;
          border-bottom: 1px solid #e6e6e6;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          overflow: hidden;
        }

        .officialPartnersTitle {
          margin: 68px 0 0;
          padding: 0;
          font-size: 22px;
          line-height: 1.2;
          font-weight: 700;
          color: #000000;
          text-align: center;
          letter-spacing: -0.2px;
        }

        .partnersLogoRow {
          width: 100%;
          max-width: 720px;
          margin-top: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 105px;
        }

        .partnerLogoBox {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
        }

        .partnerLogo {
          display: block;
          object-fit: contain;
          user-select: none;
          pointer-events: none;
        }

        .amazonLogo {
          width: 255px;
          height: auto;
        }

        .flipkartLogo {
          width: 240px;
          height: auto;
        }

        @media (max-width: 768px) {
          .officialPartnersSection {
            height: auto;
            min-height: 320px;
            padding: 58px 20px 58px;
          }

          .officialPartnersTitle {
            margin-top: 0;
            font-size: 21px;
          }

          .partnersLogoRow {
            max-width: 600px;
            margin-top: 58px;
            gap: 70px;
          }

          .amazonLogo {
            width: 190px;
          }

          .flipkartLogo {
            width: 180px;
          }
        }

        @media (max-width: 520px) {
          .officialPartnersSection {
            padding: 52px 16px 50px;
            min-height: 300px;
          }

          .officialPartnersTitle {
            font-size: 20px;
          }

          .partnersLogoRow {
            max-width: 100%;
            margin-top: 50px;
            gap: 34px;
            flex-wrap: wrap;
          }

          .partnerLogoBox {
            width: calc(50% - 18px);
          }

          .amazonLogo {
            width: 165px;
          }

          .flipkartLogo {
            width: 155px;
          }
        }

        @media (max-width: 390px) {
          .partnersLogoRow {
            gap: 24px;
          }

          .amazonLogo {
            width: 145px;
          }

          .flipkartLogo {
            width: 138px;
          }
        }
      `}</style>
    </section>
  );
}