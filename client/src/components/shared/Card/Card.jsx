import React from 'react';
import { Link } from 'react-router-dom';
import style from './Card.module.css';
const Card = ({ header, subHeading, children, footer }) => {
  return (
    <div className={style.container}>
      <div className={style.card_wrapper}>
        <h2 className={style.header}>{header}</h2>
        <p className={style.sub_header}>{subHeading}</p>
        {children}
        <div className={style.card_footer}>
          <div className={style.card_footer_content}>
            <span>{footer.footerText}</span>
            <Link to={footer.path} className={style.link}>
              {footer.linkText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
