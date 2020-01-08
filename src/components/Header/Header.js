import React from 'react';
import PropTypes from 'prop-types';
import ButtonGroup from 'react-rainbow-components/components/ButtonGroup';
import ButtonIcon from 'react-rainbow-components/components/ButtonIcon';
import AvatarMenu from 'react-rainbow-components/components/AvatarMenu';
import Avatar from 'react-rainbow-components/components/Avatar';
import Input from 'react-rainbow-components/components/Input';
import MenuItem from 'react-rainbow-components/components/MenuItem';
import MenuDivider from 'react-rainbow-components/components/MenuDivider';
import ButtonMenu from 'react-rainbow-components/components/ButtonMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRocket,
  faAngleDown,
  faBullhorn,
  faSearch,
  faPencilAlt,
  faPowerOff
} from '@fortawesome/free-solid-svg-icons';
// import { ShoppingCartIcon, MessageIcon, BarsIcon, GithubIcon } from '../icons';
import './styles.css';

export default function SectionHeading({ onToogleSidebar }) {
  return (
    <header className='react-rainbow-admin_header rainbow-position_fixed rainbow-flex rainbow-align_center rainbow-p-horizontal_large rainbow-background-color_white'>
      <img
        src='https://react-rainbow-admin.firebaseapp.com/assets/images/rainbow-logo.svg'
        alt='rainbow logo'
        className='react-rainbow-admin_header-logo'
      />
      <section className='rainbow-flex rainbow-align_center react-rainbow-admin_header-actions'>
        <ButtonGroup className='rainbow-m-right_medium'>
          <ButtonIcon
            icon={<FontAwesomeIcon icon={faRocket} />}
            variant='border-filled'
            disabled
          />
          <ButtonIcon
            icon={<FontAwesomeIcon icon={faBullhorn} />}
            variant='border-filled'
          />
          <ButtonMenu
            menuAlignment='right'
            menuSize='xx-small'
            icon={<FontAwesomeIcon icon={faAngleDown} />}
          >
            <MenuItem label='Admin-1' />
            <MenuItem label='Admin-2' />
            <MenuItem label='Admin-3' />
          </ButtonMenu>
        </ButtonGroup>
      </section>
      <ButtonIcon
        onClick={onToogleSidebar}
        className='react-rainbow-admin_header-hamburger-button'
        size='large'
        icon={null}
      />
    </header>
  );
}

SectionHeading.propTypes = {
  onToogleSidebar: PropTypes.func
};

SectionHeading.defaultProps = {
  onToogleSidebar: () => {}
};
