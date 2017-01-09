import React, { Component, PropTypes } from 'react';
import s from './makeup.css';
import domProps from './props.js';

export default class Makeup extends Component {
    static propTypes = {
        components: PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);

        const defaultState = {
            menu: true,
            mode: 2,
            q: ''
        };

        this.state = {
            menu: localStorage.getItem('menu') || true,
            zoom: 1,
            transparency: 1,
            mode: localStorage.getItem('mode') || 2,
            background: 'transparency',
            invert: false,
            elementProps: {},
            componentPath: localStorage.getItem('componentPath'),
            fixtureName: localStorage.getItem('fixtureName'),
            q: localStorage.getItem('q') || ''
        };
    }

    componentDidMount() {
        window.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.setMode(this.state.mode);
    }

    // @todo
    // componentWillUnmount() {
    //     window.removeEventListener('keydown', (e) => this.handleKeydown(e));
    // }

    componentDidUpdate() {
        const { componentPath, fixtureName, mode, q } = this.state;

        console.log(this.state);

        if (componentPath) {
            localStorage.setItem('componentPath', componentPath);
            localStorage.setItem('fixtureName', fixtureName);
        }

        if (mode) {
            localStorage.setItem('mode', mode);
        }

        if (q != null) {
            localStorage.setItem('q', q);
        }
    }

    handleKeydown(e) {
        if (e.keyCode >= 49 && e.keyCode <= 52) {
            const mode = e.keyCode - 48;

            this.setMode(mode);
        }
    }

    setMode(mode) {
        const stateMode = String(mode);

        switch (stateMode) {
            case '1': this.setState({ transparency: 0, invert: false }); break;
            case '2': this.setState({ transparency: 1, invert: false }); break;
            case '3': this.setState({ transparency: 0.5, invert: false }); break;
            case '4': this.setState({ transparency: 0.5, invert: true }); break;
        }

        this.setState({mode: stateMode});
    }

    getCurrentComponent() {
        const { componentPath } = this.state;
        const { components } = this.props;
        const component = components.find(c => c.componentPath === componentPath);

        return component;
    }

    getCurrentFixture() {
        const component = this.getCurrentComponent();

        if (!component) {
          return null;
        }

        const { fixtureName } = this.state;
        const fixture = component.fixtures.find(f => f.name === fixtureName);

        return fixture;
    }

    renderElement() {
        const component = this.getCurrentComponent();

        if (!component) {
            return null;
        }

        const { Element } = component;
        const fixture = this.getCurrentFixture();

        // It is possible when fixture was deleted, but its name in saved state
        if (!fixture) {
            return null;
        }

        return <Element {...fixture.props} />;
    }

    handleItemClick(componentPath, fixtureName) {
        this.setState({
            componentPath,
            fixtureName
        });
    }

    renderInput(data) {
        const inputProps = {
            onChange: e => this.setState({[data.name]: e.target.value}),
            value: this.state.q,
            ...data
        };

        return <input type="text" className={s.input} {...inputProps} />;
    }

    renderCheckbox(data) {
        const Icon = data.icon;
        // console.log('data.name', data.name);

        return (
            <div className={s.checkbox}>
                <input
                    type="checkbox"
                    className={s.hidden}
                    checked={!!this.state[data.name]}
                    onChange={e => this.setState({[data.name]: e.target.checked})}
                    {...data} />

                <label htmlFor={data.id} className={s.checkboxLabel} title={data.label}>
                    <Icon />
                </label>
            </div>
        );
    }

    renderSlider(data) {
        const sliderProps = {
            value: this.state[data.name],
            onChange: event => this.setState({ [data.name]: parseFloat(event.target.value) }),
            ...data
        };

        return (
            <div className={s.tool}>
                <div className={s.toolTitle}>{data.title}</div>
                <input type="range" className={s.slider} {...sliderProps} />
            </div>
        );
    }

    renderRadioGroup(data) {
        return (
            <div className={s.tool}>
                <div className={s.toolTitle}>{data.title}</div>
                {data.items.map(this.renderRadio.bind(this))}
            </div>
        );
    }

    renderRadio(data) {
        const Icon = data.icon;

        return (
            <div className={s.radio} key={data.id}>
                <input
                    type="radio"
                    className={s.hidden}
                    checked={this.state[data.name] == data.value}
                    onChange={() => {
                        this.setState({[data.name]: data.value});

                        // Универсальные функции не всегда есть хорошо @todo
                        if (data.name == 'mode') {
                            this.setMode(data.value);
                        }
                    }}
                    {...data}
                    />
                <label htmlFor={data.id} className={s.radioLabel} title={data.label}>
                    <Icon />
                </label>
            </div>
        );
    }

    renderList() {
        const { components } = this.props;
        const { q } = this.state;

        return (
            components.filter(component => {
                if (!q) {
                    return true;
                }

                return component.componentName.indexOf(q) === 0;
            }).map(component => {
                const { componentName, componentPath, fixtures } = component;

                return (
                    <div className={s.group} key={`item ${componentName}`}>
                        <div className={s.groupTitle}>{componentName}</div>
                        {
                            fixtures.map(fixture => {
                                const { name, data } = fixture;
                                let cls = s.item;

                                if (componentPath == this.state.componentPath && name == this.state.fixtureName) {
                                    cls = `${s.item} ${s._active}`;
                                }

                                return (
                                    <div
                                        className={cls}
                                        onClick={() => this.handleItemClick(componentPath, name)}
                                        key={`item ${name}`}>

                                        {name}
                                    </div>
                                );
                            })
                        }
                    </div>
                );
            })
        );
    }

    getDocumentation(props) {
        const Icon = require('babel-loader!svg-react-loader!./assets/doc.svg');

        return (
            <div className={s.doc}>
                {ctx.map(item => (
                    <a href={item.link} title={item.label} className={s.docLink}>
                        <Icon className={s.docIcon} />
                    </a>
                ))}
            </div>
        );
    }

    render() {
        const { transparency, zoom, invert, q, menu } = this.state;
        const imageTransparency = 1 - transparency;
        const component = this.getCurrentComponent();
        const fixture = this.getCurrentFixture();
        const fixtureStyles = fixture && fixture.styles || {};
        let src;
        const rootCls = menu ? `${s.wrapper} ${s._menu}` : s.wrapper;
        const imageCls = invert ? `${s.image} ${s._invert}` : s.image;

        if (component && fixture) {
            src = `/${component.componentName}/${fixture.name}.png`;
        }

        return (
            <div className={rootCls}>
                <div className={s.menu}>
                    {this.renderCheckbox(domProps.toggler)}
                    {this.renderInput(domProps.search)}
                    {this.renderRadioGroup(domProps.mode)}
                    {this.renderRadioGroup(domProps.background)}
                    {this.renderSlider(domProps.transparency)}
                    {this.renderSlider(domProps.zoom)}
                </div>

                {menu &&
                    <nav className={s.sidebar}>
                        {this.renderList()}
                    </nav>
                }

                <div className={s.main}>
                    {/* Rulers */}
                    <div className={s.container} style={{transform: `scale(${zoom})`}}>
                        <div className={s.module}>
                            <img
                                src={src}
                                className={imageCls}
                                style={{
                                    opacity: imageTransparency,
                                    ...fixtureStyles.image
                                }} />
                            <div className={s.markup} style={fixtureStyles.component}>
                                {this.renderElement()}
                            </div>
                        </div>
                    </div>
                </div>
                <footer className={s.statusbar}></footer>
            </div>
        );
    }
}
